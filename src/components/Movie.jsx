import React, { useState } from 'react'
import Drop from './Dropdown';
import Favourite from './Favourite';
import truncateText from './../util/truncate'
import { getIMDBID } from './IMDB'
import poster_not_available from './../poster_not_available.jpg';

const Movie = ({ movieData, handleMovieClick, handleFavouritesClick, favouriteMovies }) => {
	const [streamOptions, setStreamOptions] = useState({})

	const updateStreamOptions = async (movie) => {
		const imdb_id = await getIMDBID(movie)
		const url = `https://streaming-availability.p.rapidapi.com/v2/get/basic?country=us&imdb_id=${imdb_id}&output_language=en`;
		const options = {
		  method: 'GET',
		  headers: {
		    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_KEY,
		    'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
		  }
		}

		try {
		  const response = await fetch(url, options);
		  const responseJSON = await response.json();
		  const streamingOptions = responseJSON.result.streamingInfo

		  if(Object.keys(streamingOptions).length !== 0){
		    const streamingOptionsUS = streamingOptions.us // The API only provides info for the US region
		    setStreamOptions(streamingOptionsUS)
		  }
		  else{
		    const noStreamingOptions = {}
		    setStreamOptions(noStreamingOptions)
		  }
		} catch (error) {
		  console.error(error);
		}
	}

	return(
        <>
        	<div className='d-flex justify-content-start m-3 image-container'>
        		{
        			movieData.poster_path != null?
        			<>
        				<img src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`} alt='movie poster'
                    	onClick={() => handleMovieClick(movieData)}></img>
        			</>
        			:
        			<>
        				<img src={poster_not_available} alt='movie poster'
                    	onClick={() => handleMovieClick(movieData)}></img>
        			</>
        		}

                <div className='overlay stream-overlay text-dark'
                     onMouseEnter={() => updateStreamOptions(movieData)}>
                    <Drop streamOptions={streamOptions}/>
                </div>
                
                <div className='pl-1 pb-2 overlay favourite-overlay text-dark'
                     onClick={() => handleFavouritesClick(movieData)}>
                    <Favourite favouriteMovies={favouriteMovies} movie={movieData}/>
                </div>

                <div className='d-flex align-items-center justify-content-center w-100 overlay title-overlay text-dark'>
                    {
                        movieData.title !== undefined?
                        <>
                            {truncateText(movieData.title, 30)}
                        </>
                        :
                        <>
                            {truncateText(movieData.name, 30)}
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default Movie
