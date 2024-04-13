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
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Filter from './components/Filter';

function App() {
  const [movies, setMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [popularSeries, setPopularSeries] = useState([])
  const [favourites, setFavourites] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [streamOptions, setStreamOptions] = useState({})
  const [selectedMovie, setSelectedMovie] = useState({})
  const [movieHasBeenSelected, setMovieHasBeenSelected] = useState(false)
  const [selectedMovieDetails, setSelectedMovieDetails] = useState({})
  const [showMovies, setShowMovies] = useState(true)
  const [showSeries, setShowSeries] = useState(true)

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
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_KEY}&query=${searchValue}&include_adult=false&language=en-US&page=1`
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
    let favouriteMoviesIDs = []
    if(favourites !== null)
      favouriteMoviesIDs = favourites.map(obj => obj.id);
    
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

    const response = await fetch(url, options)
    const responseJSON = await response.json()

    return responseJSON.imdb_id
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

  const getDetails = async (movie) => {
    console.log("GETDETAILS - MOVIE")
    console.log(movie)
    
    let url
    if("release_date" in movie) {
      url = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`
    }
    else {
      url = `https://api.themoviedb.org/3/tv/${movie.id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`
    }



    //const url = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODJhMjdlM2QxYjU4NjlmNjc1MjQ5MTNjYTlhM2E4NCIsInN1YiI6IjY1ZDZiZGIxNjA5NzUwMDE2MjIzNTY5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mr2YERxD-URJb64LONU5yXyPxMDtYs3mZr4CVr4yw3I'
      }
    };

    const response = await fetch(url, options)
    const responseJSON = await response.json()

    return responseJSON
  }

  const showMovieDetails = async (movie) => {
    const details = await getDetails(movie)

    setSelectedMovie(movie)
    setSelectedMovieDetails(details)
    setMovieHasBeenSelected(true)
  }

  const handleMoviesCheckboxChange = () => {
    if(showMovies) {
      setShowMovies(false)
    }
    else {
      setShowMovies(true)
    }
  }

  const handleSeriesCheckboxChange = () => {
    if(showSeries) {
      setShowSeries(false)
    }
    else {
      setShowSeries(true)
    }
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
                <NavDropdown title="Filter" id="nav-dropdown">
                  <Filter showMovies={showMovies} showSeries={showSeries} changeShowMovies={handleMoviesCheckboxChange} changeShowSeries={handleSeriesCheckboxChange}/>
                </NavDropdown>
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
            {
              searchValue === ''?
                <>
                  {/* MY MOVIE QUEUE */}
                  {
                    favourites !== null && favourites.length !== 0?
                      <>
                        <div className="movie-queue">
                          <div className='row d-flex align-items-center'>
                            <MovieListHeading heading='My Movie Queue'/>
                          </div>

                          <div className="row">
                            <MovieList movies={favourites} showMovies={showMovies} showSeries={showSeries}
                            handleFavouritesClick={handleFavouriteMovie} favouriteComponent={Favourite} favouriteMovies={favourites}
                            handleStreamMouseEnter={updateStreamOptions} dropdownComponent={Drop} streamOptions={streamOptions}
                            handleMovieClick={showMovieDetails}/>
                          </div>
                        </div>
                      </>
                    :
                      <>
                      </>
                  }

                  {/* POPULAR MOVIES QUEUE */}
                  {
                    showMovies === true?
                      <>
                        <div className="movie-queue">
                          <div className='row d-flex align-items-center'>
                            <MovieListHeading heading='Popular Movies'/>
                          </div>

                          <div className="row">
                            <MovieList movies={popularMovies} showMovies={showMovies} showSeries={showSeries}
                            handleFavouritesClick={handleFavouriteMovie} favouriteComponent={Favourite} favouriteMovies={favourites}
                            handleStreamMouseEnter={updateStreamOptions} dropdownComponent={Drop} streamOptions={streamOptions}
                            handleMovieClick={showMovieDetails}/>
                          </div>
                        </div>
                      </>
                    :
                      <>
                      </>
                  }

                  {/* POPULAR SERIES QUEUE */}
                  {
                    showSeries === true?
                      <>
                        <div className="movie-queue">
                          <div className='row d-flex align-items-center'>
                            <MovieListHeading heading='Popular Series'/>
                          </div>

                          <div className="row">
                            <MovieList movies={popularSeries} showMovies={showMovies} showSeries={showSeries}
                            handleFavouritesClick={handleFavouriteMovie} favouriteComponent={Favourite} favouriteMovies={favourites}
                            handleStreamMouseEnter={updateStreamOptions} dropdownComponent={Drop} streamOptions={streamOptions}
                            handleMovieClick={showMovieDetails}/>
                          </div>
                        </div>
                      </>
                    :
                      <>
                      </>
                  }
                </>
              :
                <>
                  {/* SEARCH RESULTS */}
                  <div className="movie-queue">
                    <div className='row d-flex align-items-center'>
                      <MovieListHeading heading='Search Results'/>
                    </div>

                    <div className="row">
                      <MovieList movies={movies} showMovies={showMovies} showSeries={showSeries}
                      handleFavouritesClick={handleFavouriteMovie} favouriteComponent={Favourite} favouriteMovies={favourites}
                      handleStreamMouseEnter={updateStreamOptions} dropdownComponent={Drop} streamOptions={streamOptions}
                      handleMovieClick={showMovieDetails}/>
                    </div>
                  </div>
                </>
            }
          </>
        :
          <>
            <MovieDetails movie={selectedMovie} details={selectedMovieDetails} imdbComponent={IMDB}/>
          </>
      }
    </div>
  );
}

export default App;
