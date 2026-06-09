import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUserBookings } from "../../apis";
import TicketActions from "../booking/TicketActions";
import dayjs from "dayjs";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const BookingHistory = () => {
  const [expandedId, setExpandedId] = useState(null);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => await getUserBookings(),
    placeholderData: keepPreviousData,
  });

  const bookings = data?.data?.bookings || [];

  if (isLoading) {
    return (
      <div className="px-6">
        <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
        <p className="text-gray-500">Loading bookings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-6">
        <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
        <p className="text-gray-500">Failed to load bookings. Please try again later.</p>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="px-6">
        <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
        <p className="text-gray-500">No bookings yet. Book your first movie!</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6">
      <h3 className="text-xl font-semibold mb-6">Your Bookings</h3>

      <div className="space-y-4">
        {bookings.map((booking) => {
          const isExpanded = expandedId === booking._id;
          const movie = booking.showId?.movie;
          const theater = booking.showId?.theater;
          const show = booking.showId;

          return (
            <div
              key={booking._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              {/* Summary row */}
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : booking._id)
                }
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition"
              >
                <img
                  src={movie?.posterUrl}
                  alt={movie?.title}
                  className="w-14 h-20 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900 truncate">
                      {movie?.title}
                    </p>
                    <span className="shrink-0 bg-[#eb0028] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide">
                      M-TICKET
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {theater?.name}, {theater?.city}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {dayjs(show?.date, "DD-MM-YYYY").format("ddd, D MMM YYYY")}{" "}
                    &bull; {show?.startTime}
                  </p>
                  <p className="text-xs font-medium text-[#eb0028] mt-1">
                    {booking.seats.join(", ")} &bull; ₹{booking.bookingFee.total}
                  </p>
                </div>
                {isExpanded ? (
                  <FiChevronUp className="text-gray-400 shrink-0" size={20} />
                ) : (
                  <FiChevronDown className="text-gray-400 shrink-0" size={20} />
                )}
              </button>

              {/* Expanded ticket */}
              {isExpanded && (
                <div className="px-4 pb-6 pt-2 border-t border-gray-100 bg-gray-50">
                  <TicketActions booking={booking} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingHistory;
