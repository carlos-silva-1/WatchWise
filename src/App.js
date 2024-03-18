import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import Searchbox from './components/Searchbox';
import IMDB from './components/IMDB';
import Drop from './components/Dropdown';
import Favourite from './components/Favourite';
import MovieDetails from './components/MovieDetails';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function App() {
  const [movies, setMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [popularSeries, setPopularSeries] = useState([])
  const [favourites, setFavourites] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [streamOptions, setStreamOptions] = useState({})
  const [selectedMovie, setSelectedMovie] = useState({})
  const [movieHasBeenSelected, setMovieHasBeenSelected] = useState(false)

  useEffect(() => {
    getMovieRequest(searchValue)
  }, [searchValue])

  useEffect(() => {
    getFavouriteMovies()
  }, [])

  useEffect(() => { // Updates popular movies/series once per day
    const lastUpdateDate = localStorage.getItem('lastUpdateDate');
    const currentDate = new Date().toLocaleDateString();
    
    if (lastUpdateDate !== currentDate) {
      fetchPopularMovies()
      fetchPopularSeries()
      localStorage.setItem('lastUpdateDate', currentDate);
    }
    else {
      getPopularMovies()
      getPopularSeries()
    }
  }, []);

  const getMovieRequest = async (searchValue) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&query=${searchValue}&include_adult=false&language=en-US&page=1`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODJhMjdlM2QxYjU4NjlmNjc1MjQ5MTNjYTlhM2E4NCIsInN1YiI6IjY1ZDZiZGIxNjA5NzUwMDE2MjIzNTY5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mr2YERxD-URJb64LONU5yXyPxMDtYs3mZr4CVr4yw3I'
      }
    }

    const response = await fetch(url, options)
    const responseJSON = await response.json()

    if(responseJSON.results.length > 0){
      setMovies(responseJSON.results)
    }
  }

  const getFavouriteMovies = () => {
    const favouriteList = JSON.parse(localStorage.getItem('react-movie-app-favourites'))
    setFavourites(favouriteList)
  }

  const getPopularMovies = () => {
    const popularMoviesList = JSON.parse(localStorage.getItem('react-movie-app-popular-movies'))
    setPopularMovies(popularMoviesList)
  }

  const getPopularSeries = () => {
    const popularSeriesList = JSON.parse(localStorage.getItem('react-movie-app-popular-series'))
    setPopularSeries(popularSeriesList)
  }

  const fetchPopularMovies = async () => {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODJhMjdlM2QxYjU4NjlmNjc1MjQ5MTNjYTlhM2E4NCIsInN1YiI6IjY1ZDZiZGIxNjA5NzUwMDE2MjIzNTY5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mr2YERxD-URJb64LONU5yXyPxMDtYs3mZr4CVr4yw3I'
      }
    };

    const response = await fetch(url, options)
    const responseJSON = await response.json()

    setPopularMovies(responseJSON.results)
    localStorage.setItem('react-movie-app-popular-movies', JSON.stringify(responseJSON.results))
  }

  const fetchPopularSeries = async () => {
    const url = `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODJhMjdlM2QxYjU4NjlmNjc1MjQ5MTNjYTlhM2E4NCIsInN1YiI6IjY1ZDZiZGIxNjA5NzUwMDE2MjIzNTY5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mr2YERxD-URJb64LONU5yXyPxMDtYs3mZr4CVr4yw3I'
      }
    };

    const response = await fetch(url, options)
    const responseJSON = await response.json()

    setPopularSeries(responseJSON.results)
    localStorage.setItem('react-movie-app-popular-series', JSON.stringify(responseJSON.results))
  }

  const handleFavouriteMovie = async (movie) => {
    const favouriteMoviesIDs = favourites.map(obj => obj.id);
    
    if(favouriteMoviesIDs.includes(movie.id)) {
      removeFavouriteMovie(movie)
    }
    else {
      addFavouriteMovie(movie)
    }
  }

  const addFavouriteMovie = async (movie) => {
    let newFavouriteList = []

    if(favourites !== null){
      newFavouriteList = [...favourites, movie]
    }
    else{
      newFavouriteList = [movie]
    }

    setFavourites(newFavouriteList)
    saveFavouritesToLocalStorage(newFavouriteList)
  }

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter((favourite) => (
      favourite.id !== movie.id
    ))
    setFavourites(newFavouriteList)
    saveFavouritesToLocalStorage(newFavouriteList)
  }

  const saveFavouritesToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favourites', JSON.stringify(items))
  }

  const getIMDBID = async (movie) => {
    const url = `https://api.themoviedb.org/3/movie/${movie.id}/external_ids?api_key=${process.env.REACT_APP_TMDB_KEY}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODJhMjdlM2QxYjU4NjlmNjc1MjQ5MTNjYTlhM2E4NCIsInN1YiI6IjY1ZDZiZGIxNjA5NzUwMDE2MjIzNTY5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mr2YERxD-URJb64LONU5yXyPxMDtYs3mZr4CVr4yw3I'
      }
    };

    const response = await fetch(url)
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

  const updateStreamOptions = async (movie) => {
    const imdb_id = await getIMDBID(movie)
    const url = `https://streaming-availability.p.rapidapi.com/v2/get/basic?country=us&imdb_id=${imdb_id}&output_language=en`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_KEY,
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
      }
    }

    try {
      const response = await fetch(url, options);
      const responseJSON = await response.json();
      const streamingOptions = responseJSON.result.streamingInfo

      if(Object.keys(streamingOptions).length !== 0){
        const streamingOptionsUS = streamingOptions.us // The API only provides info for the US region
        setStreamOptions(streamingOptionsUS)
      }
      else{
        const noStreamingOptions = {}
        setStreamOptions(noStreamingOptions)
      }
    } catch (error) {
      console.error(error);
    }
  }

  const showMovieDetails = (movie) => {
    setMovieHasBeenSelected(true)
    setSelectedMovie(movie)

    /*
    CREATE A COMPONENT:
    heading of the item's title
    show imdb button on this page
    bigger poster image
    show details
    */
  }

  return (
    <div className="container-fluid movie-app">

      {/* HEADER */}
      <div className='d-flex align-items-center mt-4 header'>

        <Navbar expand="lg" variant="dark">
          <Container>
            <Navbar.Brand href="/index.html" id='brand'>MyMovieQueue</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" id="navbar-menu-icon"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <Nav.Link href="/movies.html" id='movie-nav-item'>Movies</Nav.Link>
                <Nav.Link href="/series.html" id='series-nav-item'>Series</Nav.Link>
                <Nav.Link href="/mymoviequeue.html"id='my-movie-queue-nav-item'>My List</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Searchbox searchValue={searchValue} setSearchValue={setSearchValue}/>

        <Button variant="outline-warning" className="p-2 mr-3" id='login-btn'>Login</Button>
        <Button variant="outline-warning" className="p-2" id='sign-up-btn'>Sign Up</Button>
      </div>

      {/* IF A SEARCH IS BEING MADE, ONLY SHOW THE SEARCH RESULTS. ELSE SHOW MYMOVIEQUEUE, POPULAR MOVIES AND POPULAR SERIES */}
      {
        movieHasBeenSelected === false?
          <>
            searchValue === ''?
              <>
                {/* MY MOVIE QUEUE */}
                <div className="my-movie-queue">
                  <div className='row d-flex align-items-center'>
                    <MovieListHeading heading='My Movie Queue'/>
                  </div>

                  <div className="row">
                    <MovieList movies={favourites} 
                    handleFavouritesClick={handleFavouriteMovie} favouriteComponent={Favourite} favouriteMovies={favourites}
                    handleIMDBClick={goToIMDBPage} imdbComponent={IMDB}
                    handleStreamMouseEnter={updateStreamOptions} dropdownComponent={Drop} streamOptions={streamOptions}
                    handleMovieClick={showMovieDetails}/>
                  </div>
                </div>

                {/* POPULAR MOVIES QUEUE */}
                <div className="my-movie-queue">
                  <div className='row d-flex align-items-center'>
                    <MovieListHeading heading='Popular Movies'/>
                  </div>

                  <div className="row">
                    <MovieList movies={popularMovies} 
                    handleFavouritesClick={handleFavouriteMovie} favouriteComponent={Favourite} favouriteMovies={favourites}
                    handleIMDBClick={goToIMDBPage} imdbComponent={IMDB}
                    handleStreamMouseEnter={updateStreamOptions} dropdownComponent={Drop} streamOptions={streamOptions}
                    handleMovieClick={showMovieDetails}/>
                  </div>
                </div>

                {/* POPULAR SERIES QUEUE */}
                <div className="my-movie-queue">
                  <div className='row d-flex align-items-center'>
                    <MovieListHeading heading='Popular Series'/>
                  </div>

                  <div className="row">
                    <MovieList movies={popularSeries} 
                    handleFavouritesClick={handleFavouriteMovie} favouriteComponent={Favourite} favouriteMovies={favourites}
                    handleIMDBClick={goToIMDBPage} imdbComponent={IMDB}
                    handleStreamMouseEnter={updateStreamOptions} dropdownComponent={Drop} streamOptions={streamOptions}
                    handleMovieClick={showMovieDetails}/>
                  </div>
                </div>
              </>
            :
              <>
                {/* SEARCH RESULTS */}
                <div className="search-queue">
                  <div className='row d-flex align-items-center'>
                    <MovieListHeading heading='Search Results'/>
                  </div>

                  <div className="row">
                    <MovieList movies={movies} 
                    handleFavouritesClick={handleFavouriteMovie} favouriteComponent={Favourite} favouriteMovies={favourites}
                    handleIMDBClick={goToIMDBPage} imdbComponent={IMDB}
                    handleStreamMouseEnter={updateStreamOptions} dropdownComponent={Drop} streamOptions={streamOptions}
                    handleMovieClick={showMovieDetails}/>
                  </div>
                </div>
              </>
          </>
        :
          <>
            <MovieDetails movie={selectedMovie}/>
          </>
      }
    </div>
  );
}

export default App;
