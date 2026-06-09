import mongoose from "mongoose";
import { generateBookingReference } from "../../utils";
import { IBooking } from "./booking.interface";
import BookingModel from "./booking.model";
import Razorpay from "razorpay";
import { config } from "../../config/config";
import { updateSeatStatus } from "../show/show.service";
import { UserModel } from "../user/user.model";
import { isEmailConfigured } from "../../utils/mailer";
import {
  buildTicketEmailDataFromBooking,
  sendBookingTicketEmail,
} from "./booking.email.service";

const bookingPopulate = [
  {
    path: "showId",
    select: "startTime date audioType format",
    populate: [
      {
        path: "movie",
        select: "title posterUrl duration format languages certification",
      },
      {
        path: "theater",
        select: "name location city state",
      },
    ],
  },
  {
    path: "userId",
    select: "name email phone",
  },
];

const findPopulatedBooking = (filter: object) =>
  BookingModel.findOne(filter).populate(bookingPopulate);

const sendTicketEmailForBooking = async (populatedBooking: any) => {
  const userId =
    populatedBooking.userId?._id || populatedBooking.userId;

  const recipientEmail =
    populatedBooking.userId?.email ||
    (await UserModel.findById(userId).select("email name"))?.email;

  if (!recipientEmail) {
    throw new Error("No email address found for this booking");
  }

  if (!isEmailConfigured()) {
    throw new Error(
      "Email service not configured. Set NODEMAILER_EMAIL and NODEMAILER_PASSWORD in backend .env",
    );
  }

  const ticketData = buildTicketEmailDataFromBooking(populatedBooking);
  ticketData.userEmail = recipientEmail;

  if (populatedBooking.userId?.name) {
    ticketData.userName = populatedBooking.userId.name;
  }

  await sendBookingTicketEmail(recipientEmail, ticketData);

  return recipientEmail;
};

export const createBooking = async (bookingData: IBooking, userId: string) => {
  if (
    !bookingData.showId ||
    !bookingData.seats ||
    bookingData.seats.length === 0 ||
    !bookingData.paymentId ||
    !bookingData.bookingFee
  ) {
    throw new Error(`Invalid booking data!`);
  }

  const { showId, seats, paymentId, bookingFee } = bookingData;
  const bookingRef = generateBookingReference();
  const session = await mongoose.startSession();
  session.startTransaction();

  let bookingId: mongoose.Types.ObjectId;

  try {
    const existingBooking = await BookingModel.findOne({
      showId,
      status: "CONFIRMED",
      seats: { $in: seats },
    }).session(session);

    if (existingBooking) {
      throw new Error(`One or more of the requested seats are already booked!`);
    }

    const razorpay = new Razorpay({
      key_id: config.razorpayKey,
      key_secret: config.razorpaySecret,
    });

    const paymentDetails = await razorpay.payments.fetch(paymentId);

    if (paymentDetails.status !== "captured") {
      throw new Error(`Payment not successful!`);
    }

    const [booking] = await BookingModel.create(
      [
        {
          bookingRef,
          userId,
          showId,
          seats,
          status: "CONFIRMED",
          paymentId,
          paymentMethod: paymentDetails.method,
          bookingFee,
        },
      ],
      { session },
    );

    bookingId = booking._id;
    await updateSeatStatus(showId, seats, "BOOKED", session);

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }

  const populatedBooking = await findPopulatedBooking({ _id: bookingId });

  if (!populatedBooking) {
    throw new Error("Booking created but could not be retrieved");
  }

  let emailSent = false;
  let emailTo: string | null = null;
  let emailError: string | null = null;

  try {
    emailTo = await sendTicketEmailForBooking(populatedBooking);
    emailSent = true;
    console.log(`✅ Ticket email sent to ${emailTo} for booking ${bookingRef}`);
  } catch (error: any) {
    emailError = error?.message || "Failed to send ticket email";
    console.error(`❌ Ticket email failed for booking ${bookingRef}:`, emailError);
  }

  return { booking: populatedBooking, emailSent, emailTo, emailError };
};

export const getAllBookings = async (userId: string) => {
  return await BookingModel.find({ userId })
    .populate(bookingPopulate)
    .sort({ createdAt: -1 });
};

export const getBookingById = async (bookingId: string, userId: string) => {
  const booking = await findPopulatedBooking({ _id: bookingId, userId });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

export const resendBookingTicketEmail = async (
  bookingId: string,
  userId: string,
) => {
  const booking = await getBookingById(bookingId, userId);
  const email = await sendTicketEmailForBooking(booking);

  return { email };
};
