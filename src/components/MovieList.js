import React from 'react'

const MovieList = (props) => {
    const FavouriteComponent = props.favouriteComponent
    const IMDBComponent = props.imdbComponent
    const DropdownComponent = props.dropdownComponent
    const StreamOptions = props.streamOptions

    if(props.movies !== null){
        return(
            <>
                {props.movies.map( (movie, index) => (
                    <div className='d-flex justify-content-start m-3 image-container' key={index}>

                        {/* CHANGE TO: IF MOVIE HAS POSTER IMAGE, INCLUDE IT IN THE ROW, OTHERWISE DONT */}

                        <img src={movie.Poster} alt='movie'></img>
                        <div className='stream-overlay d-flex align-items-center justify-content-center'
                             onMouseEnter={() => props.handleStreamMouseEnter(movie)}>
                            <DropdownComponent streamOptions={StreamOptions}/>
                        </div>
                        <div className='imdb-overlay d-flex align-items-center justify-content-center'
                             onClick={() => props.handleIMDBClick(movie)}>
                            <IMDBComponent/>
                        </div>
                        <div className='favourite-overlay d-flex align-items-center justify-content-center'
                             onClick={() => props.handleFavouritesClick(movie)}>
                            <FavouriteComponent/>
                        </div>
                    </div>
                ))}
            </>
        )
    }
    else{
        return(
            <>
            </>
        )
    }
    
}

export default MovieList