import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

const Filter = ({ showMovies, showSeries, changeShowMovies, changeShowSeries, genres, unselectedGenres, handleFilterGenre }) => {
    return(
        <>
            <div className="width-50vw filter-contents">

                {/* MEDIA TYPE */}
                <div>
                    <h4 className="mr-3 primary-color">Media Type </h4>
                    <Form.Check className="mr-3" label="Movie" checked={showMovies} onChange={changeShowMovies}/>
                    <Form.Check className="mr-3" label="Series" checked={showSeries} onChange={changeShowSeries}/>
                </div>

                {/* GENRE */}
                <div className="mt-3">
                    <h4 className="mr-3 primary-color">Genres </h4>
                    <div className="">
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
                </div>
            </div>
        </>
    )
}

export default Filter
