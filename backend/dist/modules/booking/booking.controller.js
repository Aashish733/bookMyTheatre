"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendTicketEmailHandler = exports.getBookingByIdHandler = exports.getUserBookingsHandler = exports.createBookingHandler = void 0;
const BookingService = __importStar(require("./booking.service"));
const createBookingHandler = async (req, res, next) => {
    try {
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
    }
    catch (error) {
        next(error);
    }
};
exports.createBookingHandler = createBookingHandler;
const getUserBookingsHandler = async (req, res, next) => {
    try {
        const bookings = await BookingService.getAllBookings(req.user._id);
        res.json({
            success: true,
            message: "User bookings fetched successfully!",
            bookings
        }).status(200);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserBookingsHandler = getUserBookingsHandler;
const getBookingByIdHandler = async (req, res, next) => {
    try {
        const booking = await BookingService.getBookingById(req.params.id, req.user._id);
        res.json({
            success: true,
            message: "Booking fetched successfully!",
            booking,
        }).status(200);
    }
    catch (error) {
        next(error);
    }
};
exports.getBookingByIdHandler = getBookingByIdHandler;
const resendTicketEmailHandler = async (req, res, next) => {
    try {
        const result = await BookingService.resendBookingTicketEmail(req.params.id, req.user._id);
        res.json({
            success: true,
            message: `Ticket sent to ${result.email}`,
        }).status(200);
    }
    catch (error) {
        next(error);
    }
};
exports.resendTicketEmailHandler = resendTicketEmailHandler;
