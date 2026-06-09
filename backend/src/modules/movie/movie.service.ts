import { IMovie } from "./movie.interface";
import { MovieModel } from "./movie.model";


// 1. createMovie
export const createMovie = async (movie: IMovie) => {
    return await MovieModel.create(movie);
}

// 2. getAllMovies (optional search)
export const getAllMovies = async (search?: string) => {
    const query: Record<string, unknown> = {};

    if (search?.trim()) {
        const regex = new RegExp(search.trim(), "i");
        query.$or = [
            { title: regex },
            { genre: regex },
            { languages: regex },
        ];
    }

    return await MovieModel.find(query).sort({ releaseDate: -1 });
}
// 3. getMovieById
export const getMovieById = async (id: string) => {
    return await MovieModel.findById(id);
}
// 4. getTopMovieByVotes
export const getTopMovieByVotes = async (limit: number) => {
    return await MovieModel.find().sort({ votes: -1}).limit(limit);;
}
