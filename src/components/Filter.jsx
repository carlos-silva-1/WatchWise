import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

const Filter = ({ showMovies, showSeries, changeShowMovies, changeShowSeries, genres, unselectedGenres, handleFilterGenre }) => {
    return(
        <>
            <div className="width-50vw">

                {/* MEDIA TYPE */}
                <Navbar expand="lg" variant="dark">
                    <h4 className="mr-3">Media Type </h4>
                    <Form.Check className="mr-3" label="Movie" checked={showMovies} onChange={changeShowMovies}/>
                    <Form.Check className="mr-3" label="Series" checked={showSeries} onChange={changeShowSeries}/>
                </Navbar>

                {/* GENRE */}
                <Navbar expand="lg" variant="dark">
                    <h4 className="mr-3">Genres </h4>
                    <div className="d-flex flex-wrap">
                        {genres.genres.map( (genre, index) => (
                            <>
                                {
                                    unselectedGenres.some(unselectedGenre => unselectedGenre === genre.id)?
                                    <>
                                        <Form.Check className="mr-3" type="switch" label={genre.name} checked={false} onChange={() => handleFilterGenre(unselectedGenres.filter(id => id !== genre.id))}/>
                                    </>
                                    :
                                    <>
                                        <Form.Check className="mr-3" type="switch" label={genre.name} checked={true} onChange={() => handleFilterGenre([...unselectedGenres, genre.id])}/>
                                    </>
                                }
                            </>
                        ))}
                    </div>
                </Navbar>
            </div>
        </>
    )
}

export default Filter
