import React from 'react'
import { languages } from '../../utils/constants'
import MovieCard from './MovieCard'

const MovieList = ({ allMovies, search }) => {
  const hasNoResults = allMovies.length === 0;

  return (
    <div className='w-full md:w-3/4 p-4'>
        <div className='flex flex-wrap gap-2 mb-4'>
            {
                languages.map((
                    lang, i
                ) => (
                    <span key={i} className='bg-white border border-gray-200
                    text-[#f74362] py-1 px-3 rounded-[24px] text-sm cursor-pointer
                    hover:bg-gray-100'>
                        {lang}
                    </span>
                ))
            }
        </div>

        <div className='flex justify-between items-center bg-white px-6 py-6 rounded mb-6'>
            <h3 className='font-semibold text-xl'>
              {search ? `Results for "${search}"` : "Coming Soon"}
            </h3>
            <a href="#" className='text-red-500 text-sm font-medium
            flex items-center'>
                Explore Upcoming Movies <span className='ml-1'>→</span>
                </a>    
        </div>    

        {hasNoResults ? (
          <div className="text-center text-gray-500 py-10">
            {search
              ? `No movies found for "${search}".`
              : "No movies available."}
          </div>
        ) : (
          <div className='flex flex-wrap gap-6'>
            {allMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}

    </div>
  )
}

export default MovieList