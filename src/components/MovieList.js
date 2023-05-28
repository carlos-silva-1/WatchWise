import React from 'react'

const MovieList = (props) => {
    const FavouriteComponent = props.favouriteComponent
    const IMDBComponent = props.imdbComponent
    const DropdownComponent = props.dropdownComponent
    const StreamOptions = props.streamOptions

    return(
        <>
            {props.movies.map( (movie, index) => (
                <div className='d-flex justify-content-start m-3 image-container' key={index}>
                    <img src={movie.Poster} alt='movie'></img>
                    <div className='stream-overlay d-flex align-items-center justify-content-center'
                         onMouseEnter={() => props.handleStreamMouseEnter(movie)}>
                        <DropdownComponent streamOptions={StreamOptions}/>
                    </div>
                    <div className='imdb-overlay d-flex align-items-center justify-content-center'
                         onClick={() => props.handleIMDBClick(movie)}>
                        <IMDBComponent/>
                    </div>
                    <div className='overlay d-flex align-items-center justify-content-center'
                         onClick={() => props.handleFavouritesClick(movie)}>
                        <FavouriteComponent/>
                    </div>
                </div>
            ))}
        </>
    )
}

export default MovieList