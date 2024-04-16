import stringToDate from './stringToDate'

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
    })
}

export { sortMoviesAlphabetically, sortMoviesByRanking, sortMoviesByPopularity, sortMoviesByDate }