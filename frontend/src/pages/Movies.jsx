import React from "react";
import BannerSlider from "../components/shared/BannerSlider";
import MovieFilters from "../components/movies/MovieFilters";
import MovieList from "../components/movies/MovieList";
import { getAllMovies } from "../apis/index";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

const Movies = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const { data: allMovies } = useQuery({
    queryKey: ["allMovies", search],
    queryFn: async () => {
      return await getAllMovies(search);
    },
    placeholderData: keepPreviousData,
    select: (res) => res.data.movies,
  });

  return (
    <div>
      <BannerSlider />
      <div
        className="flex flex-col md:flex-row bg-[#f5f5f5] min-h-screen
        md:px-[100px] pb-10 pt-8"
      >
        <MovieFilters />
        <MovieList allMovies={allMovies ?? []} search={search} />
      </div>
    </div>
  );
};

export default Movies;
