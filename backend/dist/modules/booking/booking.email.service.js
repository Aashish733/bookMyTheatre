"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTicketEmailDataFromBooking = exports.sendBookingTicketEmail = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const qrcode_1 = __importDefault(require("qrcode"));
const config_1 = require("../../config/config");
const mailer_1 = require("../../utils/mailer");
const normalizePosterUrl = (url) => {
    if (url?.includes("res.cloudinary.com") &&
        url.includes("/upload/") &&
        !url.includes("/upload/f_")) {
        return url.replace("/upload/", "/upload/f_jpg,q_auto,w_160/");
    }
    return url;
};
const buildPlainTextTicket = (data, ticketUrl) => {
    const showDateFormatted = (0, dayjs_1.default)(data.showDate, "DD-MM-YYYY").format("ddd, D MMM YYYY");
    const bookedOn = (0, dayjs_1.default)(data.bookingDateTime).format("D MMM YYYY, h:mm A");
    return [
        "BookMyTheatre - Booking Confirmed",
        "",
        `Movie: ${data.movieTitle}`,
        `Theater: ${data.theaterName}, ${data.theaterLocation}, ${data.theaterCity}, ${data.theaterState}`,
        `Show: ${showDateFormatted} at ${data.showTime} (${data.showFormat} | ${data.audioType})`,
        `Seats: ${data.seats.join(", ")}`,
        `Booking ID: ${data.bookingRef}`,
        `Booked on: ${bookedOn}`,
        `Payment: ${data.paymentMethod.toUpperCase()}`,
        `Amount paid: Rs.${data.bookingFee.total}`,
        "",
        `View ticket: ${ticketUrl}`,
        "",
        "Arrive 20 minutes before showtime. Carry a valid photo ID.",
        "Tickets are non-refundable and non-cancellable.",
    ].join("\n");
};
const buildTicketEmailHtml = (data, qrDataUrl) => {
    const ticketUrl = `${config_1.config.frontendUrl}/booking/confirmation/${data.bookingId}`;
    const showDateFormatted = (0, dayjs_1.default)(data.showDate, "DD-MM-YYYY").format("ddd, D MMM YYYY");
    const bookedOn = (0, dayjs_1.default)(data.bookingDateTime).format("D MMM YYYY, h:mm A");
    const posterUrl = normalizePosterUrl(data.moviePoster);
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your BookMyTheatre Ticket</title>
<style>
  body { margin:0; padding:0; background:#f0f0f0; font-family:Arial,Helvetica,sans-serif; }
  .wrapper { width:100%; padding:24px 0; }
  .container { max-width:560px; margin:auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,.12); }
  .header { background:#1b2238; padding:24px; text-align:center; color:#fff; }
  .brand { font-size:22px; font-weight:bold; letter-spacing:0.5px; }
  .badge { display:inline-block; background:#eb0028; color:#fff; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:4px; letter-spacing:1px; margin-top:12px; }
  .body { padding:24px; }
  .movie-row { display:flex; gap:16px; margin-bottom:20px; }
  .poster { width:80px; height:120px; border-radius:8px; object-fit:cover; background:#eee; }
  .movie-title { font-size:18px; font-weight:bold; color:#111; margin:0 0 6px; }
  .meta { font-size:13px; color:#666; line-height:20px; margin:0; }
  .divider { border-top:2px dashed #ddd; margin:20px 0; }
  .grid { display:flex; justify-content:space-between; gap:16px; }
  .label { font-size:11px; color:#999; text-transform:uppercase; letter-spacing:.5px; margin:0 0 4px; }
  .value { font-size:14px; font-weight:600; color:#222; margin:0; }
  .seats { font-size:15px; font-weight:bold; color:#eb0028; margin:0; }
  .qr-wrap { text-align:center; margin-top:20px; padding:16px; background:#fafafa; border-radius:8px; }
  .qr-wrap img { width:120px; height:120px; }
  .qr-hint { font-size:12px; color:#888; margin-top:8px; }
  .amount { background:#f8f8f8; border-radius:8px; padding:16px; margin-top:20px; }
  .amount-row { display:flex; justify-content:space-between; font-size:13px; color:#555; margin-bottom:6px; }
  .amount-total { display:flex; justify-content:space-between; font-size:16px; font-weight:bold; color:#111; border-top:1px solid #ddd; padding-top:10px; margin-top:10px; }
  .note { font-size:12px; color:#888; line-height:20px; margin-top:20px; }
  .btn { display:inline-block; background:#eb0028; color:#fff; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:bold; font-size:14px; margin-top:16px; }
  .footer { background:#fafafa; text-align:center; padding:16px; font-size:12px; color:#999; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="container">
    <div class="header">
      <div class="brand">BookMyTheatre</div>
      <div class="badge">M-TICKET</div>
      <p style="margin:12px 0 0;font-size:14px;">Booking Confirmed!</p>
    </div>
    <div class="body">
      <div class="movie-row">
        <img class="poster" src="${posterUrl}" alt="${data.movieTitle}">
        <div>
          <p class="movie-title">${data.movieTitle}</p>
          <p class="meta">${data.certification} &bull; ${data.languages.join(", ")} &bull; ${data.format.join(" | ")}</p>
          <p class="meta">${data.duration}</p>
          <p class="meta" style="margin-top:8px;font-weight:600;color:#333;">${data.theaterName}</p>
          <p class="meta">${data.theaterLocation}, ${data.theaterCity}, ${data.theaterState}</p>
        </div>
      </div>
      <div class="divider"></div>
      <div class="grid">
        <div>
          <p class="label">Show Date</p>
          <p class="value">${showDateFormatted}</p>
        </div>
        <div>
          <p class="label">Show Time</p>
          <p class="value">${data.showTime}</p>
        </div>
        <div>
          <p class="label">Format</p>
          <p class="value">${data.showFormat} &bull; ${data.audioType}</p>
        </div>
      </div>
      <div style="margin-top:20px;">
        <p class="label">Seats (${data.seats.length})</p>
        <p class="seats">${data.seats.join(", ")}</p>
      </div>
      <div class="grid" style="margin-top:20px;">
        <div>
          <p class="label">Booking ID</p>
          <p class="value">${data.bookingRef}</p>
        </div>
        <div>
          <p class="label">Booked On</p>
          <p class="value">${bookedOn}</p>
        </div>
        <div>
          <p class="label">Payment</p>
          <p class="value">${data.paymentMethod.toUpperCase()}</p>
        </div>
      </div>
      <div class="qr-wrap">
        <img src="${qrDataUrl}" alt="QR Code">
        <p class="qr-hint">Show this QR code at the cinema entrance</p>
      </div>
      <div class="amount">
        <div class="amount-row"><span>Ticket(s)</span><span>Rs.${data.bookingFee.ticketPrice}</span></div>
        <div class="amount-row"><span>Convenience Fee</span><span>Rs.${data.bookingFee.convenience}</span></div>
        <div class="amount-total"><span>Amount Paid</span><span>Rs.${data.bookingFee.total}</span></div>
      </div>
      <p class="note">
        Hi ${data.userName}, your booking is confirmed. Please arrive at least 20 minutes before showtime.
        Carry a valid photo ID. This is an M-Ticket - no physical printout required.
        Tickets are non-refundable and non-cancellable.
      </p>
      <center><a class="btn" href="${ticketUrl}">View and Download Ticket</a></center>
    </div>
    <div class="footer">BookMyTheatre &bull; Sent to ${data.userEmail}</div>
  </div>
</div>
</body>
</html>`;
};
const sendBookingTicketEmail = async (email, ticketData) => {
    const ticketUrl = `${config_1.config.frontendUrl}/booking/confirmation/${ticketData.bookingId}`;
    const qrDataUrl = await qrcode_1.default.toDataURL(ticketData.bookingRef, {
        width: 140,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
    });
    const html = buildTicketEmailHtml(ticketData, qrDataUrl);
    const text = buildPlainTextTicket(ticketData, ticketUrl);
    return await (0, mailer_1.sendMail)({
        to: email,
        subject: `Your BookMyTheatre ticket - ${ticketData.bookingRef}`,
        html,
        text,
    });
};
exports.sendBookingTicketEmail = sendBookingTicketEmail;
const buildTicketEmailDataFromBooking = (booking) => {
    const show = booking.showId;
    const movie = show?.movie;
    const theater = show?.theater;
    const user = booking.userId;
    if (!show || !movie || !theater) {
        throw new Error("Booking ticket data is incomplete. Show details missing.");
    }
    return {
        bookingId: booking._id.toString(),
        bookingRef: booking.bookingRef,
        seats: booking.seats,
        bookingDateTime: booking.bookingDateTime || booking.createdAt,
        paymentMethod: booking.paymentMethod,
        bookingFee: booking.bookingFee,
        userName: user?.name || "Guest",
        userEmail: user?.email || "",
        movieTitle: movie.title,
        moviePoster: movie.posterUrl,
        certification: movie.certification,
        languages: movie.languages || [],
        format: Array.isArray(movie.format) ? movie.format : [movie.format],
        duration: movie.duration,
        theaterName: theater.name,
        theaterCity: theater.city,
        theaterState: theater.state,
        theaterLocation: theater.location,
        showDate: show.date,
        showTime: show.startTime,
        audioType: show.audioType || "Dolby Atmos",
        showFormat: show.format || "2D",
    };
};
exports.buildTicketEmailDataFromBooking = buildTicketEmailDataFromBooking;
