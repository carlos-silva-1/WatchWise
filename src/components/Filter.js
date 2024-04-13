import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

const Filter = ({ showMovies, showSeries, changeShowMovies, changeShowSeries }) => {
    return(
        <>
            <Navbar expand="lg" variant="dark">
                {
                    showMovies?
                        <>
                            <Form.Check type="switch" label="Movie" checked="true" onChange={changeShowMovies}/>
                        </>
                    :
                        <>
                            <Form.Check type="switch" label="Movie" onChange={changeShowMovies}/>
                        </>
                }
                {
                    showSeries?
                        <>
                            <Form.Check type="switch" label="Series" checked="true" onChange={changeShowSeries}/>
                        </>
                    :
                        <>
                            <Form.Check type="switch" label="Series" onChange={changeShowSeries}/>
                        </>
                }
            </Navbar>
        </>
    )
}

export default Filter