import React from 'react'

/*
    show details to the side of the poster
*/

const MovieDetails = (props) => {
    const movie = props.movie
    const details = props.details
    const IMDBComponent = props.imdbComponent
    console.log("movie")
    console.log(movie)
    console.log("details")
    console.log(details)

    return(
        <>
        	<div className="movie-details row">
                <div className="col-auto">
        		  <h1>{movie.title}</h1>
                </div>
                <div className="col-auto">
                    <div className="mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#FFC107" class="bi bi-star-fill" viewBox="0 0 16 16" className="mr-2 mb-2 pb-1">
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        <h3 className="d-inline mt-2">{details.vote_average} / 10</h3>
                        <h5 className="d-inline ml-3">({details.vote_count} votes)</h5>
                    </div>
                </div>
                <div className="col mt-1" onClick={() => props.handleIMDBClick(movie)}>
                    <IMDBComponent/>
                </div>
        	</div>

            <div className="row">
                <div className="col-auto">
                    <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt='movie' className="details-poster"/>
                </div>
                <div className="col">
                    <div className="deeets">
                        <div id="details-overview">
                            <h2>Overview</h2>
                            {details.overview}
                        </div>
                        <div id="details-release-date" className="mt-4">
                            <h2>Release Date</h2>
                            {details.release_date}
                        </div>
                        <div id="details-genres" className="mt-4">
                            <h2>Genres</h2>
                            {details.genres.map( (genre, index) => (
                                <>
                                    <span className="mr-4 d-inline">{genre.name}</span>
                                </>
                            ))}
                        </div>
                        <div id="details-companies" className="mt-4">
                            <h2>Production Companies</h2>
                            {details.production_companies.map( (company, index) => (
                                <>
                                    <span className="mr-4 d-inline">{company.name}</span>
                                </>
                            ))}
                        </div>
                        <div id="details-runtime" className="mt-4">
                            <h2>Runtime</h2>
                            {details.runtime} Minutes
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MovieDetails