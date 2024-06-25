import React from 'react'
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types'

const Filter = ({ showMovies, showSeries, changeShowMovies, changeShowSeries, genres, genresToHide, setGenresToHide }) => {
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
                    <div>
                        {genres.genres && genres.genres.map( (genre, index) => (
                            <div key={index}>
                                {
                                    genresToHide.some(unselectedGenre => unselectedGenre === genre.id)?
                                    <>
                                        <Form.Check className="mr-3" type="switch" label={genre.name} checked={false} onChange={() => setGenresToHide(genresToHide.filter(id => id !== genre.id))}/>
                                    </>
                                    :
                                    <>
                                        <Form.Check className="mr-3" type="switch" label={genre.name} checked={true} onChange={() => setGenresToHide([...genresToHide, genre.id])}/>
                                    </>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

Filter.propTypes = {
    showMovies: PropTypes.bool.isRequired,
    showSeries: PropTypes.bool.isRequired, 
    changeShowMovies: PropTypes.func.isRequired,
    changeShowSeries: PropTypes.func.isRequired,
    genres: PropTypes.object.isRequired,
    genresToHide: PropTypes.array.isRequired,
    setGenresToHide: PropTypes.func.isRequired
}

export default Filter
