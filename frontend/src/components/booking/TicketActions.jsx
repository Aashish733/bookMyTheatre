import { useState } from "react";
import { FiDownload, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import BookingTicket from "./BookingTicket";
import { downloadTicketAsPdf } from "../../utils/downloadTicket";
import { resendTicketEmail } from "../../apis";

const TicketActions = ({ booking }) => {
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadTicketAsPdf(booking);
      toast.success("Ticket downloaded!");
    } catch (err) {
      console.error("PDF download failed:", err);
      toast.error(err?.message || "Failed to download ticket. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setSending(true);
      const res = await resendTicketEmail(booking._id);
      toast.success(res?.data?.message || "Ticket sent to your email!");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send email. Check your email settings.";
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <BookingTicket booking={booking} />

      <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1b2238] text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-60"
        >
          <FiDownload size={18} />
          {downloading ? "Downloading..." : "Download Ticket"}
        </button>
        <button
          onClick={handleResendEmail}
          disabled={sending}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-[#eb0028] text-[#eb0028] py-3 px-4 rounded-xl font-semibold text-sm hover:bg-red-50 transition disabled:opacity-60"
        >
          <FiMail size={18} />
          {sending ? "Sending..." : "Email Ticket"}
        </button>
      </div>
    </div>
  );
};

export default TicketActions;
