import React from 'react'
import truncateText from './../util/truncate'

const MovieList = (props) => {
    const FavouriteComponent = props.favouriteComponent
    const IMDBComponent = props.imdbComponent
    const DropdownComponent = props.dropdownComponent
    const StreamOptions = props.streamOptions
    const FavouriteMovies = props.favouriteMovies

    if(props.movies !== null){
        return(
            <>
                {props.movies.map( (movie, index) => (
                    <>
                        {
                            movie.poster_path != null?
                                <>
                                    <div className='d-flex justify-content-start m-3 image-container' key={index}>
                                        <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt='movie'></img>
                                        <div className='overlay stream-overlay d-flex align-items-center justify-content-center'
                                             onMouseEnter={() => props.handleStreamMouseEnter(movie)}>
                                            <DropdownComponent streamOptions={StreamOptions}/>
                                        </div>
                                        <div className='overlay imdb-overlay d-flex align-items-center justify-content-center'
                                             onClick={() => props.handleIMDBClick(movie)}>
                                            <IMDBComponent/>
                                        </div>
                                        <div className='overlay favourite-overlay d-flex align-items-center justify-content-center'
                                             onClick={() => props.handleFavouritesClick(movie)}>
                                            <FavouriteComponent favouriteMovies={FavouriteMovies} movie={movie}/>
                                        </div>
                                        <div className='overlay title-overlay d-flex align-items-center justify-content-center'>
                                            {
                                                movie.title !== undefined?
                                                    <>
                                                        {truncateText(movie.title, 30)}
                                                    </>
                                                :
                                                    <>
                                                        {truncateText(movie.name, 30)}
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </>
                            :
                                <>
                                </>
                        }
                    </>
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