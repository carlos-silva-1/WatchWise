import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import Searchbox from './components/Searchbox';
import AddFavourite from './components/AddFavourites';
import RemoveFavourites from './components/RemoveFavourites';
import IMDB from './components/IMDB';
import Drop from './components/Dropdown';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

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
    const url = `https://www.omdbapi.com/?s=${searchValue}&apikey=${process.env.REACT_APP_OMDB_KEY}`
    const response = await fetch(url)
    const responseJSON = await response.json()

    if(responseJSON.Search){
      setMovies(responseJSON.Search)
    }
  }

  const getFavouriteMovies = () => {
    const favouriteList = JSON.parse(localStorage.getItem('react-movie-app-favourites'))
    setFavourites(favouriteList)
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

      <div className='d-flex align-items-center mt-4 header'>

        <Navbar>
          <Navbar.Brand href="/index.html" id='brand'>MyMovieQueue</Navbar.Brand>
          <Nav>
            <Nav.Link href="/movies.html" id='movie-nav-item'>Movies</Nav.Link>
            <Nav.Link href="/series.html" id='series-nav-item'>Series</Nav.Link>
            <Nav.Link href="/mymoviequeue.html"id='my-movie-queue-nav-item'>My List</Nav.Link>
          </Nav>
        </Navbar>

        <Searchbox searchValue={searchValue} setSearchValue={setSearchValue}/>

        <Button variant="outline-warning" className="p-2 mr-3" id='login-btn'>Login</Button>
        <Button variant="outline-warning" className="p-2" id='sign-up-btn'>Sign Up</Button>
      </div>

      <div className="my-movie-queue">
        <div className='row d-flex align-items-center mb-4 heading'>
          <MovieListHeading heading='My Movie Queue'/>
        </div>

        <div className="row">
          <MovieList movies={favourites} 
          handleFavouritesClick={removeFavouriteMovie} favouriteComponent={RemoveFavourites}
          handleIMDBClick={goToIMDBPage} imdbComponent={IMDB}
          handleStreamMouseEnter={updateStreamOptions} dropdownComponent={Drop} streamOptions={streamOptions}/>
        </div>
      </div>

      <div className='row d-flex align-items-center mt-4 mb-4 heading'>
        <MovieListHeading heading='Search Results'/>
      </div>

      <div className="row">
        <MovieList movies={movies} 
        handleFavouritesClick={addFavouriteMovie} favouriteComponent={AddFavourite}
        handleIMDBClick={goToIMDBPage} imdbComponent={IMDB}
        handleStreamMouseEnter={updateStreamOptions} dropdownComponent={Drop} streamOptions={streamOptions}/>
      </div>

    </div>
  );
}

export default App;

// Only show search results if a search has been made
