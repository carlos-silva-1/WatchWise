const searchMovie = async (searchValue, pageNumber = 1) => {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_KEY}&query=${searchValue}&include_adult=false&language=en-US&page=${pageNumber}`
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`
        }
    }

    try {
        const response = await fetch(url, options)
        const responseJSON = await response.json()
        return responseJSON.results
    } catch (error) {
        throw new Error(error);
    }
}

const fetchPopular = async (mediaType = "movie", pageNumber = 1) => {
    const url = `https://api.themoviedb.org/3/${mediaType}/popular?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${pageNumber}`
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`
        }
    }

    try{
        const response = await fetch(url, options)
        const responseJSON = await response.json()
        return responseJSON.results
    } catch (error) {
        throw new Error(error);
    }
}

const getDetails = async (movie) => {
    let url
    if("release_date" in movie)
        url = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`
    else 
        url = `https://api.themoviedb.org/3/tv/${movie.id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`
    
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`
        }
    }

    try{
        const response = await fetch(url, options)
        const responseJSON = await response.json()
        return responseJSON
    } catch (error) {
        throw new Error(error);
    }
}

export { searchMovie, fetchPopular, getDetails }
