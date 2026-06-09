import jsPDF from "jspdf";
import QRCode from "qrcode";
import dayjs from "dayjs";
import { groupSeatsByType } from "./index";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const fetchPosterAsDataUrl = async (posterUrl) => {
  if (!posterUrl) return null;

  let url = posterUrl;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    url = url.replace("/upload/", "/upload/f_jpg,q_auto,w_200/");
  }

  try {
    const response = await fetch(
      `${API_BASE}/proxy-image?url=${encodeURIComponent(url)}`,
      { credentials: "include" },
    );
    if (!response.ok) return null;

    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const generateTicketPdf = async (booking) => {
  if (!booking?.bookingRef) {
    throw new Error("Invalid booking data");
  }

  const show = booking.showId;
  const movie = show?.movie;
  const theater = show?.theater;
  const user = booking.userId;

  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  pdf.setFillColor(27, 34, 56);
  pdf.roundedRect(margin, y, contentW, 28, 3, 3, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("BookMyTheatre", pageW / 2, y + 10, { align: "center" });

  pdf.setFillColor(235, 0, 40);
  pdf.roundedRect(pageW / 2 - 14, y + 13, 28, 6, 1, 1, "F");
  pdf.setFontSize(7);
  pdf.text("M-TICKET", pageW / 2, y + 17.2, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("Booking Confirmed", pageW / 2, y + 24, { align: "center" });

  y += 34;

  const posterData = await fetchPosterAsDataUrl(movie?.posterUrl);
  const textX = posterData ? margin + 32 : margin;

  if (posterData) {
    pdf.addImage(posterData, "JPEG", margin, y, 28, 42);
  }

  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(movie?.title || "Movie", textX, y + 6, { maxWidth: contentW - (posterData ? 32 : 0) });

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(107, 114, 128);
  pdf.text(
    [movie?.certification, movie?.languages?.join(", "), movie?.format?.join(" | ")]
      .filter(Boolean)
      .join("  |  "),
    textX,
    y + 12,
    { maxWidth: contentW - (posterData ? 32 : 0) },
  );
  pdf.text(movie?.duration || "", textX, y + 17);

  pdf.setTextColor(31, 41, 55);
  pdf.setFont("helvetica", "bold");
  pdf.text(theater?.name || "", textX, y + 24);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(107, 114, 128);
  pdf.text(
    [theater?.location, theater?.city, theater?.state].filter(Boolean).join(", "),
    textX,
    y + 29,
    { maxWidth: contentW - (posterData ? 32 : 0) },
  );

  y += 48;

  pdf.setDrawColor(229, 231, 235);
  pdf.setLineDashPattern([2, 2], 0);
  pdf.line(margin, y, margin + contentW, y);
  pdf.setLineDashPattern([], 0);
  y += 8;

  const colW = contentW / 3;
  const details = [
    { label: "DATE", value: dayjs(show?.date, "DD-MM-YYYY").format("ddd, D MMM") },
    { label: "TIME", value: show?.startTime || "" },
    { label: "SCREEN", value: `${show?.format || ""} | ${show?.audioType || ""}` },
  ];

  details.forEach((item, index) => {
    const x = margin + index * colW;
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
    pdf.text(item.label, x, y);
    pdf.setFontSize(10);
    pdf.setTextColor(31, 41, 55);
    pdf.setFont("helvetica", "bold");
    pdf.text(item.value, x, y + 5, { maxWidth: colW - 2 });
    pdf.setFont("helvetica", "normal");
  });

  y += 14;
  pdf.line(margin, y, margin + contentW, y);
  y += 8;

  pdf.setFontSize(7);
  pdf.setTextColor(156, 163, 175);
  pdf.text(`${booking.seats.length} TICKET(S)`, margin, y);
  y += 5;

  groupSeatsByType(booking.seats).forEach(({ type, seats }) => {
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    pdf.text(`${type}: `, margin, y);
    pdf.setTextColor(235, 0, 40);
    pdf.setFont("helvetica", "bold");
    pdf.text(seats.join(", "), margin + pdf.getTextWidth(`${type}: `), y);
    pdf.setFont("helvetica", "normal");
    y += 6;
  });

  y += 4;

  const qrDataUrl = await QRCode.toDataURL(booking.bookingRef, {
    width: 280,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });
  pdf.addImage(qrDataUrl, "PNG", margin, y, 35, 35);

  const infoX = margin + 42;
  const infoLines = [
    ["BOOKING ID", booking.bookingRef],
    ["BOOKED FOR", user?.name || "Guest"],
    ["CONTACT", `+91-${user?.phone || ""} | ${user?.email || ""}`],
    [
      "BOOKED ON",
      dayjs(booking.bookingDateTime || booking.createdAt).format("D MMM YYYY, h:mm A"),
    ],
  ];

  let infoY = y + 5;
  infoLines.forEach(([label, value]) => {
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
    pdf.text(label, infoX, infoY);
    pdf.setFontSize(9);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont("helvetica", "bold");
    pdf.text(String(value), infoX, infoY + 4, { maxWidth: contentW - 42 });
    pdf.setFont("helvetica", "normal");
    infoY += 10;
  });

  y += 42;

  pdf.setFillColor(243, 244, 246);
  pdf.roundedRect(margin, y, contentW, 32, 2, 2, "F");
  y += 7;

  [
    ["Ticket(s)", `Rs.${booking.bookingFee.ticketPrice}`],
    ["Convenience Fee", `Rs.${booking.bookingFee.convenience}`],
  ].forEach(([label, value]) => {
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    pdf.text(label, margin + 5, y);
    pdf.text(value, margin + contentW - 5, y, { align: "right" });
    y += 6;
  });

  pdf.setDrawColor(209, 213, 219);
  pdf.line(margin + 5, y, margin + contentW - 5, y);
  y += 5;

  pdf.setFontSize(12);
  pdf.setTextColor(17, 24, 39);
  pdf.setFont("helvetica", "bold");
  pdf.text("Amount Paid", margin + 5, y);
  pdf.text(`Rs.${booking.bookingFee.total}`, margin + contentW - 5, y, { align: "right" });
  y += 6;

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(156, 163, 175);
  pdf.text(
    `Paid via ${booking.paymentMethod?.toUpperCase() || "ONLINE"} | ID: ${booking.paymentId?.slice(-8) || ""}`,
    margin + 5,
    y,
  );

  y += 12;

  pdf.setFillColor(255, 251, 235);
  pdf.setDrawColor(254, 243, 199);
  pdf.roundedRect(margin, y, contentW, 18, 2, 2, "FD");
  pdf.setFontSize(8);
  pdf.setTextColor(146, 64, 14);
  pdf.text(
    "Important: Arrive 20 minutes before showtime. Carry a valid photo ID. This M-Ticket is valid on your phone. Tickets are non-refundable.",
    margin + 4,
    y + 6,
    { maxWidth: contentW - 8 },
  );

  pdf.save(`BookMyTheatre-${booking.bookingRef}.pdf`);
};
