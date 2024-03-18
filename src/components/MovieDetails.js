import React from 'react'

/*
    CREATE A COMPONENT:
    heading of the item's title
    show imdb button on this page
    bigger poster image
    show details
*/

const MovieDetails = (props) => {
	const movie = props.movie
    return(
        <>
        	<div className="movie-details">
        		<h1>{movie.title}</h1>
        	</div>
        </>
    )
}

export default MovieDetails