import { Router } from "express";
import * as BookingController from "./booking.controller";
import { isVerifiedUser } from "../../middlewares/auth.middleware";


const router = Router();

router.post("/", isVerifiedUser , BookingController.createBookingHandler);
router.get("/", isVerifiedUser , BookingController.getUserBookingsHandler);
router.get("/:id", isVerifiedUser , BookingController.getBookingByIdHandler);
router.post("/:id/resend-email", isVerifiedUser , BookingController.resendTicketEmailHandler);

export default router;