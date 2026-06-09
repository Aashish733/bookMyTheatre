import * as BookingService from "./booking.service";
import { Request, Response, NextFunction } from "express";

export const createBookingHandler = async (req: Request, res: Response, next: NextFunction) => {

    try{

        const result = await BookingService.createBooking(req.body, req.user._id);
        const message = result.emailSent
            ? `Booking confirmed! Ticket sent to ${result.emailTo}`
            : result.emailError
            ? `Booking confirmed! Email could not be sent: ${result.emailError}`
            : "Booking confirmed!";

        res.status(201).json({
            success: true,
            message,
            booking: result.booking,
            emailSent: result.emailSent,
            emailTo: result.emailTo,
            emailError: result.emailError,
        });

    }catch(error){
        next(error);
    }

}

export const getUserBookingsHandler = async (req: Request, res: Response, next: NextFunction) => {

    try{    
        const bookings = await BookingService.getAllBookings(req.user._id);
        res.json({
            success : true,
            message : "User bookings fetched successfully!",
            bookings
        }).status(200);
    }catch(error){
        next(error);
    }       
}

export const getBookingByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking = await BookingService.getBookingById(req.params.id, req.user._id);
        res.json({
            success: true,
            message: "Booking fetched successfully!",
            booking,
        }).status(200);
    } catch (error) {
        next(error);
    }
};

export const resendTicketEmailHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await BookingService.resendBookingTicketEmail(req.params.id, req.user._id);
        res.json({
            success: true,
            message: `Ticket sent to ${result.email}`,
        }).status(200);
    } catch (error) {
        next(error);
    }
};