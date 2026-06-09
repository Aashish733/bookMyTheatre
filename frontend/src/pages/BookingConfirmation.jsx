import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "../apis";
import TicketActions from "../components/booking/TicketActions";
import { useAuth } from "../context/AuthContext";
import { IoCheckmarkCircle } from "react-icons/io5";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const { state: bookingState } = useLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId,
  });

  const booking = data?.data?.booking;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading your ticket...</p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Booking not found.</p>
        <Link to="/" className="text-[#eb0028] font-medium underline">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <IoCheckmarkCircle className="text-green-500 mx-auto" size={48} />
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Booking Confirmed!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {bookingState?.emailSent
              ? `Your ticket has been emailed to ${bookingState.emailTo}.`
              : bookingState?.emailError
              ? `Booking confirmed, but email could not be sent: ${bookingState.emailError}`
              : "Your M-Ticket is ready. Download it below or use Email Ticket to resend it to your inbox."}
          </p>
        </div>

        <TicketActions booking={booking} />

        <div className="text-center mt-6">
          <Link
            to={`/profile/${user?._id}/booking`}
            className="text-sm text-[#eb0028] font-semibold hover:underline"
          >
            View all bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
