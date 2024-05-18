import React, { useState, useEffect } from 'react'
import IMDB from './IMDB';
import formatAsDollarAmount from './../util/formatAsDollar'
import ReactPlayer from 'react-player'
import movieTrailer from 'movie-trailer'
import poster_not_available from './../poster_not_available.jpg'
import PropTypes from 'prop-types'
import { getDetails } from './../api/api_handler'

const MovieDetails = ({ movie }) => {
    const [trailerURL, setTrailerURL] = useState("")
    const [details, setDetails] = useState({})
    
    if("release_date" in movie){
        movieTrailer(movie.title)
        .then((result) => {
            setTrailerURL(result)
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    const fetchDetails = async (movie) => {
        const details = await getDetails(movie)
        setDetails(details)
    }

    useEffect(() => {
        fetchDetails(movie)
    }, [])

    return(
        <>
            <div className="mt-5 pt-5 details">
                <div>
                    <div className="text-center">
                        {
                            "release_date" in movie?
                            <>
                                <h1>{movie.title}</h1>
                            </>
                            :
                            <>
                                <h1>{movie.name}</h1>
                            </>
                        }
                    </div>

                    <div className="mt-2 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#FFC107" className="bi bi-star-fill" viewBox="0 0 16 16" className="mr-2 mb-2 pb-1">
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        <h3 className="d-inline">{details.vote_average} / 10</h3>
                        <h5 className="d-inline ml-3">({details.vote_count} votes)</h5>
                    </div>
                    
                    <div className="text-center">
                        <IMDB movie={movie}/>
                    </div>
                </div>

                <div className="mt-3 ml-5 mr-5">
                    <div className="d-flex justify-content-center">
                        {
                            movie.poster_path != null?
                            <>
                                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt='poster' className="details-poster"/>
                            </>
                            :
                            <>
                                <img src={poster_not_available} alt='poster' className="details-poster"/>
                            </>
                        }
                    </div>

                    {
                        details != undefined && Object.keys(details).length > 0?
                        <>
                            <div className="text-center">
                                <div>
                                    <div>
                                        <h2 className="primary-color mt-3">Overview</h2>
                                        {details.overview}
                                    </div>

                                    {
                                        "release_date" in movie? /* Checks if its a movie: tv series don't have the field 'release_date' */
                                        <>
                                            <div className="mt-4">
                                                <h2 className="primary-color">Genres</h2>
                                                <div>
                                                    {details.genres.map( (genre, index) => {
                                                        return(
                                                            <>
                                                                <span key={index} className="mr-4 d-inline">{genre.name}</span>
                                                            </>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <h2 className="primary-color">Release Date</h2>
                                                {details.release_date}
                                            </div>

                                            <div className="mt-4">
                                                <h2 className="primary-color">Runtime</h2>
                                                {details.runtime} Minutes
                                            </div>

                                            <div className="mt-4">
                                                <h2 className="primary-color">Budget</h2>
                                                {formatAsDollarAmount(details.budget)}
                                            </div>

                                            <div className="mt-4">
                                                <h2 className="primary-color">Revenue</h2>
                                                {formatAsDollarAmount(details.revenue)}
                                            </div>

                                            <div className="mt-4">
                                                <h2 className="primary-color">Production Companies</h2>
                                                <div>
                                                    {details.production_companies.map( (company, index) => {
                                                        return(
                                                            <>
                                                                <span key={index} className="mr-4 d-inline">{company.name}</span>
                                                            </>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="mt-4">
                                                <h2 className="primary-color">Genres</h2>
                                                {details.genres.map( (genre, index) => (
                                                    <>
                                                        <span key={index} className="mr-4 d-inline">{genre.name}</span>
                                                    </>
                                                ))}
                                            </div>

                                            <div className="mt-4">
                                                <h2 className="primary-color">First Air Date</h2>
                                                {details.first_air_date}
                                            </div>

                                            <div className="mt-4">
                                                <h2 className="primary-color">Episode Runtime</h2>
                                                {details.episode_run_time[0]} Minutes
                                            </div>

                                            <div className="mt-4">
                                                <h2 className="primary-color">Number of Seasons</h2>
                                                {details.number_of_seasons}
                                            </div>

                                            <div className="mt-4">
                                                <h2 className="primary-color">Number of Episodes</h2>
                                                {details.number_of_episodes}
                                            </div>

                                            <div className="mt-4">
                                                <h2 className="primary-color">Production Companies</h2>
                                                {details.production_companies.map( (company, index) => (
                                                    <>
                                                        <span key={index} className="mr-4 d-inline">{company.name}</span>
                                                    </>
                                                ))}
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </>
                        :
                        <>
                        </>
                    }
                </div>

                {
                    // Only shows trailer if its a movie
                    "release_date" in movie?
                    <>
                        <h2 className="mt-4 text-center primary-color">Trailer</h2>
                        <div className="mt-4 trailer-wrapper">
                            <ReactPlayer className="react-player" width="80%" height="80%" url={trailerURL} controls={true} />
                        </div>
                    </>
                    :
                    <>
                    </>
                }
            </div>
        </>
    )
}

MovieDetails.propTypes = {
    movie: PropTypes.object.isRequired
}

export default MovieDetails
