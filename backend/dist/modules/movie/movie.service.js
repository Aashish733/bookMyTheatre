"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopMovieByVotes = exports.getMovieById = exports.getAllMovies = exports.createMovie = void 0;
const movie_model_1 = require("./movie.model");
// 1. createMovie
const createMovie = async (movie) => {
    return await movie_model_1.MovieModel.create(movie);
};
exports.createMovie = createMovie;
// 2. getAllMovies (optional search)
const getAllMovies = async (search) => {
    const query = {};
    if (search?.trim()) {
        const regex = new RegExp(search.trim(), "i");
        query.$or = [
            { title: regex },
            { genre: regex },
            { languages: regex },
        ];
    }
    return await movie_model_1.MovieModel.find(query).sort({ releaseDate: -1 });
};
exports.getAllMovies = getAllMovies;
// 3. getMovieById
const getMovieById = async (id) => {
    return await movie_model_1.MovieModel.findById(id);
};
exports.getMovieById = getMovieById;
// 4. getTopMovieByVotes
const getTopMovieByVotes = async (limit) => {
    return await movie_model_1.MovieModel.find().sort({ votes: -1 }).limit(limit);
    ;
};
exports.getTopMovieByVotes = getTopMovieByVotes;
