import { Types } from "mongoose";
import { IMovie } from "../modules/movie/movie.interface";
import { IShow } from "../modules/show/show.interface";
import { IThreater } from "../modules/theater/theater.interface";
import { customAlphabet } from "nanoid";

type GroupedShow = {
  movie: Types.ObjectId | IMovie;
  theater: {
    theaterDetails: Types.ObjectId | IThreater;
    shows: Array<{
      _id: string;
      date: string;
      startTime: string;
      format: string;
      audioType: string;
    }>;
  };
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const SEAT_PRICES = {
  PREMIUM: 510,
  EXECUTIVE: 290,
  NORMAL: 180,
} as const;

const createRow = (
  row: string,
  type: keyof typeof SEAT_PRICES,
  seatCount: number,
) => ({
  row,
  type,
  price: SEAT_PRICES[type],
  seats: Array.from({ length: seatCount }, (_, i) => ({
    number: i + 1,
    status: "AVAILABLE" as const,
  })),
});

export const generateSeatLayout = () => {
  // Back rows (furthest from screen) → front rows (closest to screen)
  const premiumRows = ["K", "J"].map((row) => createRow(row, "PREMIUM", 18));
  const executiveRows = ["I", "H", "G", "F", "E", "D"].map((row) =>
    createRow(row, "EXECUTIVE", 24),
  );
  const normalRows = ["C", "B", "A"].map((row) => createRow(row, "NORMAL", 24));

  return [...premiumRows, ...executiveRows, ...normalRows];
};

// Grouping function
export const groupShowsByTheatreAndMovie = (shows: IShow[]): GroupedShow[] => {
  const grouped: Record<string, GroupedShow> = {};

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


const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
export const generateBookingReference = (): string => {
  return `BMT-${nanoid()}`;
};