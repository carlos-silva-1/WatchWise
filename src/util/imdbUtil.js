const getIMDBID = async (movie) => {
    const url = "release_date" in movie? 
                `https://api.themoviedb.org/3/movie/${movie.id}/external_ids?api_key=${process.env.REACT_APP_TMDB_KEY}`
                :
                `https://api.themoviedb.org/3/tv/${movie.id}/external_ids?api_key=${process.env.REACT_APP_TMDB_KEY}`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODJhMjdlM2QxYjU4NjlmNjc1MjQ5MTNjYTlhM2E4NCIsInN1YiI6IjY1ZDZiZGIxNjA5NzUwMDE2MjIzNTY5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mr2YERxD-URJb64LONU5yXyPxMDtYs3mZr4CVr4yw3I'
      }
    };

    const response = await fetch(url, options)
    const responseJSON = await response.json()

    return responseJSON.imdb_id
}

const goToIMDBPage = async (movie) => {
    const imdb_id = await getIMDBID(movie)

    if(imdb_id){
      const imdbUrl = `https://www.imdb.com/title/${imdb_id}`
      window.open(imdbUrl)
    }
}

export default goToIMDBPage