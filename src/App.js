import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import Searchbox from './components/Searchbox';
import IMDB from './components/IMDB';
import Drop from './components/Dropdown';
import Favourite from './components/Favourite'
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function App() {
  const [movies, setMovies] = useState([])
  const [favourites, setFavourites] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [streamOptions, setStreamOptions] = useState({})

  useEffect(() => {
    getMovieRequest(searchValue)
  }, [searchValue])

  useEffect(() => {
    getFavouriteMovies()
  }, [])

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
    //console.log(responseJSON)

    if(responseJSON.Search){
      setMovies(responseJSON.Search)
    }
  }

  const getFavouriteMovies = () => {
    const favouriteList = JSON.parse(localStorage.getItem('react-movie-app-favourites'))
    setFavourites(favouriteList)
  }

  const handleFavouriteMovie = async (movie) => {
    const favouriteMoviesIDs = favourites.map(obj => obj.imdbID);
    
    if(favouriteMoviesIDs.includes(movie.imdbID)) {
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
    saveToLocalStorage(newFavouriteList)
  }

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter((favourite) => (
      favourite.imdbID !== movie.imdbID
    ))
    setFavourites(newFavouriteList)
    saveToLocalStorage(newFavouriteList)
  }

  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favourites', JSON.stringify(items))
  }

  const goToIMDBPage = async (movie) => {
    const url = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_KEY}&t="${movie.Title}"`
    const response = await fetch(url)
    const responseJSON = await response.json()

    if(responseJSON.imdbID){
      const imdbUrl = `https://www.imdb.com/title/${responseJSON.imdbID}`
      window.open(imdbUrl)
    }
  }

  const updateStreamOptions = async (movie) => {
    const url = `https://streaming-availability.p.rapidapi.com/v2/get/basic?country=us&imdb_id=${movie.imdbID}&output_language=en`;
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
      const streamingInfo = responseJSON.result.streamingInfo

      if(Object.keys(streamingInfo).length !== 0){ // CHANGE FOR A MORE DESCRIPTIVE FUNCTION
        const streamingInfoUS = streamingInfo.us // The API only provides info for the US region
        setStreamOptions(streamingInfoUS)
      }
      else{
        const noStreamingOptions = {}
        setStreamOptions(noStreamingOptions)
      }
    } catch (error) {
      console.error(error);
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

      {/* IF A SEARCH IS BEING MADE, ONLY SHOW THE SEARCH RESULTS. ELSE SHOW MYMOVIEQUEUE, NEW MOVIES AND NEW SERIES */}
      {
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
                handleStreamMouseEnter={updateStreamOptions} dropdownComponent={Drop} streamOptions={streamOptions}/>
              </div>
            </div>

            {/* NEW MOVIES QUEUE */}

            {/* NEW SERIES QUEUE */}
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
                handleStreamMouseEnter={updateStreamOptions} dropdownComponent={Drop} streamOptions={streamOptions}/>
              </div>
            </div>
          </>
      }
    </div>
  );
}

export default App;
