import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import stringToDate from './../util/stringToDate'
import PropTypes from 'prop-types'

const SORT_PARAMS = {
    ALPHABETICALLY: 'alphabetically',
    RANKING: 'ranking',
    POPULARITY: 'popularity',
    RELEASE_DATE: 'release date'
}

const sortMoviesAlphabetically = (movies) => {
    movies.sort((movie1, movie2) => {
        if(movie1.title && movie2.title)
            return movie1.title.toLowerCase().localeCompare(movie2.title.toLowerCase())
        else if(movie1.title && movie2.name)
            return movie1.title.toLowerCase().localeCompare(movie2.name.toLowerCase())
        else if(movie1.name && movie2.title)
            return movie1.name.toLowerCase().localeCompare(movie2.title.toLowerCase())
        else if(movie1.name && movie2.name)
            return movie1.name.toLowerCase().localeCompare(movie2.name.toLowerCase())
        return 0
    })
}

const sortMoviesByRanking = (movies) => {
    movies.sort((movie1, movie2) => {
        const movie1Ranking = parseInt(movie1.vote_average, 10)
        const movie2Ranking = parseInt(movie2.vote_average, 10)

        if(movie1Ranking < movie2Ranking)
            return 1
        else if(movie1Ranking > movie2Ranking)
            return -1
        else
            return 0
    })
}

const sortMoviesByPopularity = (movies) => {
    movies.sort((movie1, movie2) => {
        const movie1Popularity = parseInt(movie1.popularity, 10)
        const movie2Popularity = parseInt(movie2.popularity, 10)

        if(movie1Popularity < movie2Popularity)
            return 1
        else if(movie1Popularity > movie2Popularity)
            return -1
        else
            return 0
    })
}

const sortMoviesByDate = (movies) => {
    movies.sort((movie1, movie2) => {
        // in case either movie1 or movie2 is a person (e.g. actor or director), it can't be compared to other items
        if("gender" in movie1 || "gender" in movie2) {
            return 0
        }
        else {
            let movie1Date = "release_date" in movie1? movie1.release_date : movie1.first_air_date
            let movie2Date = "release_date" in movie2? movie2.release_date : movie2.first_air_date

            movie1Date = stringToDate(movie1Date)
            movie2Date = stringToDate(movie2Date)

            if(movie1Date < movie2Date)
                return 1
            else if(movie1Date > movie2Date)
                return -1
            else
                return 0
        }
    })
}

const sortMovies = (movies, sortParameter) => {
    if(movies != null) {
        if(sortParameter.toLowerCase() === SORT_PARAMS.ALPHABETICALLY)
            sortMoviesAlphabetically(movies)
        else if(sortParameter.toLowerCase() === SORT_PARAMS.RANKING)
            sortMoviesByRanking(movies)
        else if(sortParameter.toLowerCase() === SORT_PARAMS.POPULARITY)
            sortMoviesByPopularity(movies)
        else if(sortParameter.toLowerCase() === SORT_PARAMS.RELEASE_DATE)
            sortMoviesByDate(movies)
    }
}

const Sort = ({ sortParameter, setSortParameter }) => {
    return(
        <>
        	<div>
        		<Navbar expand="lg" variant="dark">
                    <Form>
                        {[SORT_PARAMS.ALPHABETICALLY, SORT_PARAMS.RANKING, SORT_PARAMS.POPULARITY, SORT_PARAMS.RELEASE_DATE].map((parameter, index) => (
                            <Form.Check key={index} type={'radio'} label={parameter} 
                                checked={sortParameter.toLowerCase() === parameter? true : false}
                                onChange={sortParameter.toLowerCase() === parameter?
                                            () => setSortParameter('')
                                            :
                                            () => setSortParameter(parameter)}
                            />
                        ))}
                    </Form>
                </Navbar>
        	</div>    
        </>
    )
}

Sort.propTypes = {
    sortParameter: PropTypes.string.isRequired,
    setSortParameter: PropTypes.func.isRequired
}

export default Sort
export { sortMoviesAlphabetically, sortMoviesByRanking, sortMoviesByPopularity, sortMoviesByDate, sortMovies, SORT_PARAMS }
