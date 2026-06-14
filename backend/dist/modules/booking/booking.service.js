"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendBookingTicketEmail = exports.getBookingById = exports.getAllBookings = exports.createBooking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../../utils");
const booking_model_1 = __importDefault(require("./booking.model"));
const razorpay_1 = __importDefault(require("razorpay"));
const config_1 = require("../../config/config");
const show_service_1 = require("../show/show.service");
const user_model_1 = require("../user/user.model");
const mailer_1 = require("../../utils/mailer");
const booking_email_service_1 = require("./booking.email.service");
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
const findPopulatedBooking = (filter) => booking_model_1.default.findOne(filter).populate(bookingPopulate);
const sendTicketEmailForBooking = async (populatedBooking) => {
    const userId = populatedBooking.userId?._id || populatedBooking.userId;
    const recipientEmail = populatedBooking.userId?.email ||
        (await user_model_1.UserModel.findById(userId).select("email name"))?.email;
    if (!recipientEmail) {
        throw new Error("No email address found for this booking");
    }
    if (!(0, mailer_1.isEmailConfigured)()) {
        throw new Error("Email service not configured. Set NODEMAILER_EMAIL and NODEMAILER_PASSWORD in backend .env");
    }
    const ticketData = (0, booking_email_service_1.buildTicketEmailDataFromBooking)(populatedBooking);
    ticketData.userEmail = recipientEmail;
    if (populatedBooking.userId?.name) {
        ticketData.userName = populatedBooking.userId.name;
    }
    await (0, booking_email_service_1.sendBookingTicketEmail)(recipientEmail, ticketData);
    return recipientEmail;
};
const createBooking = async (bookingData, userId) => {
    if (!bookingData.showId ||
        !bookingData.seats ||
        bookingData.seats.length === 0 ||
        !bookingData.paymentId ||
        !bookingData.bookingFee) {
        throw new Error(`Invalid booking data!`);
    }
    const { showId, seats, paymentId, bookingFee } = bookingData;
    const bookingRef = (0, utils_1.generateBookingReference)();
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    let bookingId;
    try {
        const existingBooking = await booking_model_1.default.findOne({
            showId,
            status: "CONFIRMED",
            seats: { $in: seats },
        }).session(session);
        if (existingBooking) {
            throw new Error(`One or more of the requested seats are already booked!`);
        }
        const razorpay = new razorpay_1.default({
            key_id: config_1.config.razorpayKey,
            key_secret: config_1.config.razorpaySecret,
        });
        const paymentDetails = await razorpay.payments.fetch(paymentId);
        if (paymentDetails.status !== "captured") {
            throw new Error(`Payment not successful!`);
        }
        const [booking] = await booking_model_1.default.create([
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
        ], { session });
        bookingId = booking._id;
        await (0, show_service_1.updateSeatStatus)(showId, seats, "BOOKED", session);
        await session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
    const populatedBooking = await findPopulatedBooking({ _id: bookingId });
    if (!populatedBooking) {
        throw new Error("Booking created but could not be retrieved");
    }
    let emailSent = false;
    let emailTo = null;
    let emailError = null;
    try {
        emailTo = await sendTicketEmailForBooking(populatedBooking);
        emailSent = true;
        console.log(`✅ Ticket email sent to ${emailTo} for booking ${bookingRef}`);
    }
    catch (error) {
        emailError = error?.message || "Failed to send ticket email";
        console.error(`❌ Ticket email failed for booking ${bookingRef}:`, emailError);
    }
    return { booking: populatedBooking, emailSent, emailTo, emailError };
};
exports.createBooking = createBooking;
const getAllBookings = async (userId) => {
    return await booking_model_1.default.find({ userId })
        .populate(bookingPopulate)
        .sort({ createdAt: -1 });
};
exports.getAllBookings = getAllBookings;
const getBookingById = async (bookingId, userId) => {
    const booking = await findPopulatedBooking({ _id: bookingId, userId });
    if (!booking) {
        throw new Error("Booking not found");
    }
    return booking;
};
exports.getBookingById = getBookingById;
const resendBookingTicketEmail = async (bookingId, userId) => {
    const booking = await (0, exports.getBookingById)(bookingId, userId);
    const email = await sendTicketEmailForBooking(booking);
    return { email };
};
exports.resendBookingTicketEmail = resendBookingTicketEmail;
