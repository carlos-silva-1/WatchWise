import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import Searchbox from './components/Searchbox';
import IMDB from './components/IMDB';
import MovieDetails from './components/MovieDetails';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Filter from './components/Filter';
import Sort from './components/Sort';
import genres from './resources/genres.json';

function App() {
  const [movies, setMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [popularSeries, setPopularSeries] = useState([])
  const [favourites, setFavourites] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [selectedMovie, setSelectedMovie] = useState({})
  const [movieHasBeenSelected, setMovieHasBeenSelected] = useState(false)
  const [selectedMovieDetails, setSelectedMovieDetails] = useState({})
  const [showMovies, setShowMovies] = useState(true)
  const [showSeries, setShowSeries] = useState(true)
  const [unselectedGenres, setUnselectedGenres] = useState([])
  const [sortParameter, setSortParameter] = useState('')

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

  const getDetails = async (movie) => {
    let url
    if("release_date" in movie) {
      url = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`
    }
    else {
      url = `https://api.themoviedb.org/3/tv/${movie.id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`
    }

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

  const handleFilterGenre = (unselectedGenresArray) => {
    setUnselectedGenres(unselectedGenresArray)
  }

  const handleSortClick = (selectedSortParameter) => {
    setSortParameter(selectedSortParameter)
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
                <NavDropdown title="Filter" id="filter-dropdown">
                  <Filter showMovies={showMovies} showSeries={showSeries} changeShowMovies={handleMoviesCheckboxChange} changeShowSeries={handleSeriesCheckboxChange}
                  genres={genres} unselectedGenres={unselectedGenres} handleFilterGenre={handleFilterGenre}/>
                </NavDropdown>
                <NavDropdown title="Sort" id="sort-dropdown">
                  <Sort sortParameter={sortParameter} handleSortClick={handleSortClick}/>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Searchbox searchValue={searchValue} setSearchValue={setSearchValue}/>

        <Button variant="outline-warning" className="p-2 mr-3" id='login-btn'>Login</Button>
        <Button variant="outline-warning" className="p-2" id='sign-up-btn'>Sign Up</Button>
      </div>

      {/* BODY */}
      {
        // If a movie has been clicked, show its details
        movieHasBeenSelected === true?
        <>
          <MovieDetails movie={selectedMovie} details={selectedMovieDetails} imdbComponent={IMDB}/>
        </>
        :
        <>
          {
            // IF A SEARCH IS BEING MADE, ONLY SHOW THE SEARCH RESULTS. ELSE SHOW MOVIE QUEUES
            searchValue !== ''?
            <>
              {/* SEARCH RESULTS */}
              <div className="movie-queue">
                <div className='row d-flex align-items-center'>
                  <MovieListHeading heading='Search Results'/>
                </div>

                <div className="row">
                  <MovieList movies={movies} numberOfMovies={favourites.length} sortParameter={sortParameter}
                  showMovies={showMovies} showSeries={showSeries} unselectedGenres={unselectedGenres}
                  handleFavouritesClick={handleFavouriteMovie} favouriteMovies={favourites}
                  handleMovieClick={showMovieDetails} />
                </div>
              </div>
            </>
            :
            <>
              {/* MY MOVIE QUEUE */}
              {
                favourites !== null && favourites.length !== 0?
                <>
                  <div className="movie-queue pb-5">
                    <div className='row d-flex align-items-center'>
                      <MovieListHeading heading='My Movie Queue'/>
                    </div>

                    <div className="row">
                      <MovieList movies={favourites} numberOfMovies={favourites.length} sortParameter={sortParameter}
                      showMovies={showMovies} showSeries={showSeries} unselectedGenres={unselectedGenres}
                      handleFavouritesClick={handleFavouriteMovie} favouriteMovies={favourites}
                      handleMovieClick={showMovieDetails} />
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
                  <div className="movie-queue pb-5 mt-5">
                    <div className='row d-flex align-items-center'>
                      <MovieListHeading heading='Popular Movies'/>
                    </div>

                    <div className="row">
                      <MovieList movies={popularMovies} numberOfMovies={favourites.length} sortParameter={sortParameter}
                      showMovies={showMovies} showSeries={showSeries} unselectedGenres={unselectedGenres}
                      handleFavouritesClick={handleFavouriteMovie} favouriteMovies={favourites}
                      handleMovieClick={showMovieDetails} />
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
                  <div className="movie-queue mt-5">
                    <div className='row d-flex align-items-center'>
                      <MovieListHeading heading='Popular Series'/>
                    </div>

                    <div className="row">
                      <MovieList movies={popularSeries} numberOfMovies={favourites.length} sortParameter={sortParameter}
                      showMovies={showMovies} showSeries={showSeries} unselectedGenres={unselectedGenres}
                      handleFavouritesClick={handleFavouriteMovie} favouriteMovies={favourites}
                      handleMovieClick={showMovieDetails} />
                    </div>
                  </div>
                </>
                :
                <>
                </>
              }
            </>
          }
        </>
      }
    </div>
  );
}

export default App;
