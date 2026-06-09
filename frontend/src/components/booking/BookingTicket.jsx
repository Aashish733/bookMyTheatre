import { forwardRef } from "react";
import dayjs from "dayjs";
import { groupSeatsByType } from "../../utils";
import { MdChair, MdLocationOn, MdAccessTime, MdMovie } from "react-icons/md";
import { HiTicket } from "react-icons/hi2";

const BookingTicket = forwardRef(({ booking }, ref) => {
  if (!booking) return null;

  const show = booking.showId;
  const movie = show?.movie;
  const theater = show?.theater;
  const user = booking.userId;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(booking.bookingRef)}`;

  return (
    <div
      ref={ref}
      data-ticket-root
      className="w-full max-w-lg mx-auto bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200"
    >
      {/* Header */}
      <div className="bg-[#1b2238] px-6 py-5 text-white text-center relative">
        <img
          src="https://res.cloudinary.com/dp0exl89b/image/upload/v1780759879/bookmytheatre_transparent_fradxk.png"
          alt="BookMyTheatre"
          className="h-8 mx-auto object-contain"
          crossOrigin="anonymous"
        />
        <span className="inline-block mt-3 bg-[#eb0028] text-white text-[10px] font-bold px-3 py-1 rounded tracking-widest">
          M-TICKET
        </span>
        <p className="text-xs text-gray-300 mt-2">Booking Confirmed</p>
      </div>

      {/* Perforated edge */}
      {/* <div
        className="h-3 bg-[#1b2238]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 8px 12px, #ffffff 6px, transparent 7px)",
          backgroundSize: "16px 12px",
          backgroundRepeat: "repeat-x",
        }}
      /> */}
      <div className="bg-[#1b2238] leading-none" data-perforated-edge>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="12"
    viewBox="0 0 600 12"
    preserveAspectRatio="none"
    className="block"
  >
    <rect width="600" height="12" fill="#1b2238" />

    <g fill="#ffffff">
      {Array.from({ length: 34 }).map((_, i) => (
        <circle
          key={i}
          cx={8 + i * 18}
          cy="12"
          r="4"
        />
      ))}
    </g>
  </svg>
</div>

      <div className="p-5">
        {/* Movie + poster */}
        <div className="flex gap-4 pb-4 border-b border-dashed border-gray-200">
          <img
            src={movie?.posterUrl}
            alt={movie?.title}
            className="w-20 h-[120px] rounded-lg object-cover shrink-0 shadow-sm"
            crossOrigin="anonymous"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              {movie?.title}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {movie?.certification} &bull; {movie?.languages?.join(", ")} &bull;{" "}
              {movie?.format?.join(" | ")}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{movie?.duration}</p>
            <div className="flex items-start gap-1 mt-2">
              <MdLocationOn className="text-[#eb0028] shrink-0 mt-0.5" size={14} />
              <div>
                <p className="text-sm font-semibold text-gray-800">{theater?.name}</p>
                <p className="text-xs text-gray-500">
                  {theater?.location}, {theater?.city}, {theater?.state}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Show details grid */}
        <div className="grid grid-cols-3 gap-3 py-4 border-b border-dashed border-gray-200">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              Date
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              {dayjs(show?.date, "DD-MM-YYYY").format("ddd, D MMM")}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              Time
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5 flex items-center gap-1">
              <MdAccessTime size={14} className="text-gray-400" />
              {show?.startTime}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              Screen
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5 flex items-center gap-1">
              <MdMovie size={14} className="text-gray-400" />
              {show?.format} &bull; {show?.audioType}
            </p>
          </div>
        </div>

        {/* Seats */}
        <div className="py-4 border-b border-dashed border-gray-200">
          <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-2">
            {booking.seats.length} Ticket{booking.seats.length > 1 ? "s" : ""}
          </p>
          {groupSeatsByType(booking.seats).map(({ type, seats }) => (
            <div key={type} className="flex items-center gap-2 mb-1.5">
              <MdChair className="text-[#eb0028]" size={18} />
              <span className="text-sm font-medium text-gray-700">{type}</span>
              <span className="text-sm font-bold text-[#eb0028]">
                {seats.join(", ")}
              </span>
            </div>
          ))}
        </div>

        {/* QR + booking info */}
        <div className="flex gap-4 py-4">
          <div className="shrink-0 text-center">
            <img
              src={qrUrl}
              alt="Booking QR"
              className="w-28 h-28 rounded-lg border border-gray-100"
              crossOrigin="anonymous"
            />
            <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">
              Scan at entrance
            </p>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                Booking ID
              </p>
              <p className="text-sm font-bold text-gray-900 font-mono">
                {booking.bookingRef}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                Booked For
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "Guest"}
              </p>
              <p className="text-xs text-gray-500">
                +91-{user?.phone} &bull; {user?.email}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                Booked On
              </p>
              <p className="text-xs text-gray-600">
                {dayjs(booking.bookingDateTime || booking.createdAt).format(
                  "D MMM YYYY, h:mm A",
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Payment summary */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Ticket(s)</span>
            <span>₹{booking.bookingFee.ticketPrice}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Convenience Fee</span>
            <span>₹{booking.bookingFee.convenience}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2">
            <span className="flex items-center gap-1">
              <HiTicket className="text-[#eb0028]" />
              Amount Paid
            </span>
            <span>₹{booking.bookingFee.total}</span>
          </div>
          <p className="text-[10px] text-gray-400 pt-1">
            Paid via {booking.paymentMethod?.toUpperCase()} &bull; ID:{" "}
            {booking.paymentId?.slice(-8)}
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
          <p className="text-[11px] text-amber-800 leading-relaxed">
            <strong>Important:</strong> Arrive 20 minutes before showtime. Carry a
            valid photo ID. This M-Ticket is valid on your phone — no printout
            needed. Tickets are non-refundable and non-cancellable.
          </p>
        </div>
      </div>
    </div>
  );
});

BookingTicket.displayName = "BookingTicket";

export default BookingTicket;
