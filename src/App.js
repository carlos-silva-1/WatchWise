import React, { useState, useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import Searchbox from './components/Searchbox';
import MovieDetails from './components/MovieDetails';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Filter from './components/Filter';
import Sort from './components/Sort';
import genres from './resources/genres.json';
import { searchMovie } from './api/api_handler'
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import useLocalStorage from './hooks/useLocalStorage'
import { LIST_TYPE } from './components/MovieList';

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const [movieHasBeenSelected, setMovieHasBeenSelected] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState({})

  const [showMovies, setShowMovies] = useState(true)
  const [showSeries, setShowSeries] = useState(true)
  const [genresToHide, setGenresToHide] = useState([])
  
  const [sortParameter, setSortParameter] = useState('')

  const [showFilterOverlay, setShowFilterOverlay] = useState(false)
  const [showSortOverlay, setShowSortOverlay] = useState(false)
  const filterRef = useRef(null)
  const sortRef = useRef(null)

  const [favourites, setFavourites] = useState([])
  const [favouritesLocalStorage, setFavouritesLocalStorage] = useLocalStorage('favourites', [])

  const handleFavouriteMovie = async (movie) => {
    let favouriteMoviesIDs = []
    if(favourites != null)
      favouriteMoviesIDs = favourites.map(obj => obj.id);
    
    if(favouriteMoviesIDs.includes(movie.id))
      removeFavouriteMovie(movie)
    else 
      addFavouriteMovie(movie)
  }

  const addFavouriteMovie = async (movie) => {
    let newFavouriteList = []

    if(favourites !== null)
      newFavouriteList = [...favourites, movie]
    else
      newFavouriteList = [movie]

    setFavourites(newFavouriteList)
    setFavouritesLocalStorage(newFavouriteList)
  }

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter((favourite) => (
      favourite.id !== movie.id
    ))

    setFavourites(newFavouriteList)
    setFavouritesLocalStorage(newFavouriteList)
  }

  const showMovieDetails = async (movie) => {
    setMovieHasBeenSelected(true)
    setSelectedMovie(movie)
  }

  useEffect(() => {
    const fetchSearchResults = async () => {
      const fetchedMovies = await searchMovie(searchValue)
      setSearchResults(fetchedMovies)
    }

    fetchSearchResults()
  }, [searchValue])


  useEffect(() => {
    setFavourites(favouritesLocalStorage)
  }, [])

  return (
    <div className="position-relative">

      {/* HEADER */}
      <div id="header" className='d-flex justify-content-between bg-dark-custom z-1'>
        <Navbar expand="lg" variant="dark" className="pl-5">
          <Container>
            <Navbar.Brand href="/index.html" id='brand'>WatchWise</Navbar.Brand>
            <Navbar.Toggle id="navbar-hamburger-icon"/>
            <Navbar.Collapse>
              <Nav>
                <Nav.Item className="mr-2">
                  <Button id="filter-btn" variant="outline-warning" ref={filterRef} onClick={() => setShowFilterOverlay(prevShowFilter => !prevShowFilter)}>Filter &#x25BC;</Button>
                  <Overlay target={filterRef.current} show={showFilterOverlay} placement="bottom">
                    {(props) => (
                      <Tooltip id="tooltip-overlay" {...props}>
                        <Filter showMovies={showMovies} showSeries={showSeries} 
                        changeShowMovies={() => setShowMovies(prevShowMovies => !prevShowMovies)} changeShowSeries={() => setShowSeries(prevShowSeries => !prevShowSeries)} 
                        genres={genres} genresToHide={genresToHide} setGenresToHide={setGenresToHide}/>
                      </Tooltip>
                    )}
                  </Overlay>
                </Nav.Item>

                <Nav.Item>
                  <Button id="sort-btn" variant="outline-warning" ref={sortRef} onClick={() => setShowSortOverlay(prevShowSort => !prevShowSort)}>Sort &#x25BC;</Button>
                  <Overlay target={sortRef.current} show={showSortOverlay} placement="bottom">
                    {(props) => (
                      <Tooltip id="tooltip-overlay" {...props}>
                        <Sort sortParameter={sortParameter} setSortParameter={setSortParameter}/>
                      </Tooltip>
                    )}
                  </Overlay>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className="d-flex justify-content-end pr-4 mr-5">
          <Searchbox searchValue={searchValue} setSearchValue={setSearchValue}/>
        </div>
      </div>

      <div>
        {/* BODY */}
        {
          // If a movie has been clicked, show its details
          movieHasBeenSelected === true?
          <>
            <MovieDetails movie={selectedMovie} />
          </>
          :
          <>
            {
              // IF A SEARCH IS BEING MADE, ONLY SHOW THE SEARCH RESULTS. ELSE SHOW MOVIE LISTS
              searchValue !== ''?
              <>
                {/* SEARCH RESULTS */}
                <div className="movie-list">
                  <div className='d-flex justify-content-center'>
                    <MovieListHeading heading='Search Results'/>
                  </div>

                  <div className="d-flex justify-content-center">
                    <MovieList movies={searchResults} listType={LIST_TYPE.SEARCH_RESULTS} searchValue={searchValue}
                    sortParameter={sortParameter} genresToHide={genresToHide}
                    showMovies={showMovies} showSeries={showSeries}
                    handleFavouritesClick={handleFavouriteMovie} favouriteMovies={favourites}
                    handleMovieClick={showMovieDetails} />
                  </div>
                </div>
              </>
              :
              <>
                {/* FAVOURITE MOVIES LIST */}
                {
                  favourites != null && favourites.length !== 0 && 
                  (showMovies === true || showSeries === true)?
                  <>
                    <div className="movie-list pb-5 mt-5">
                      <div className='d-flex justify-content-center'>
                        <MovieListHeading heading='Favourites'/>
                      </div>

                      <div className="d-flex justify-content-center">
                        <MovieList listType={LIST_TYPE.FAVOURITES}
                        sortParameter={sortParameter} genresToHide={genresToHide}
                        showMovies={showMovies} showSeries={showSeries}
                        handleFavouritesClick={handleFavouriteMovie} favouriteMovies={favourites} 
                        handleMovieClick={showMovieDetails}/>
                      </div>
                    </div>
                  </>
                  :
                  <>
                  </>
                }

                {/* POPULAR MOVIES LIST */}
                {
                  showMovies === true?
                  <>
                    <div className="movie-list pb-5 mt-5">
                      <div className='d-flex justify-content-center'>
                        <MovieListHeading heading='Popular Movies'/>
                      </div>

                      <div className="d-flex justify-content-center">
                        <MovieList listType={LIST_TYPE.POPULAR_MOVIES}
                        sortParameter={sortParameter} genresToHide={genresToHide}
                        showMovies={showMovies} showSeries={showSeries} 
                        handleFavouritesClick={handleFavouriteMovie} favouriteMovies={favourites} 
                        handleMovieClick={showMovieDetails}/>
                      </div>
                    </div>
                  </>
                  :
                  <>
                  </>
                }

                {/* POPULAR SERIES LIST */}
                {
                  showSeries === true?
                  <>
                    <div className="movie-list mt-5">
                      <div className='d-flex justify-content-center'>
                        <MovieListHeading heading='Popular Series'/>
                      </div>

                      <div className="d-flex justify-content-center">
                        <MovieList listType={LIST_TYPE.POPULAR_SERIES}
                        sortParameter={sortParameter} genresToHide={genresToHide}
                        showMovies={showMovies} showSeries={showSeries}
                        handleFavouritesClick={handleFavouriteMovie} favouriteMovies={favourites}
                        handleMovieClick={showMovieDetails}/>
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
    </div>
  );
}

export default App;
