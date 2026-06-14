"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBookingReference = exports.groupShowsByTheatreAndMovie = exports.generateSeatLayout = exports.isValidEmail = void 0;
const nanoid_1 = require("nanoid");
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const SEAT_PRICES = {
    PREMIUM: 510,
    EXECUTIVE: 290,
    NORMAL: 180,
};
const createRow = (row, type, seatCount) => ({
    row,
    type,
    price: SEAT_PRICES[type],
    seats: Array.from({ length: seatCount }, (_, i) => ({
        number: i + 1,
        status: "AVAILABLE",
    })),
});
const generateSeatLayout = () => {
    // Back rows (furthest from screen) → front rows (closest to screen)
    const premiumRows = ["K", "J"].map((row) => createRow(row, "PREMIUM", 18));
    const executiveRows = ["I", "H", "G", "F", "E", "D"].map((row) => createRow(row, "EXECUTIVE", 24));
    const normalRows = ["C", "B", "A"].map((row) => createRow(row, "NORMAL", 24));
    return [...premiumRows, ...executiveRows, ...normalRows];
};
exports.generateSeatLayout = generateSeatLayout;
// Grouping function
const groupShowsByTheatreAndMovie = (shows) => {
    const grouped = {};
    shows.forEach((show) => {
        const movieId = show.movie._id;
        const theatreId = show.theater._id;
        const key = `${movieId}_${theatreId}`;
        if (!grouped[key]) {
            grouped[key] = {
                movie: show.movie,
                theater: {
                    theaterDetails: show.theater,
                    shows: [],
                },
            };
        }
        grouped[key].theater.shows.push({
            _id: show._id ?? "",
            date: show.date ?? "",
            startTime: show.startTime ?? "",
            format: show.format ?? "",
            audioType: show.audioType ?? "",
        });
    });
    return Object.values(grouped);
};
exports.groupShowsByTheatreAndMovie = groupShowsByTheatreAndMovie;
const nanoid = (0, nanoid_1.customAlphabet)("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
const generateBookingReference = () => {
    return `BMT-${nanoid()}`;
};
exports.generateBookingReference = generateBookingReference;
