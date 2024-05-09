import React from 'react'
import PropTypes from 'prop-types'

const MovieListHeading = ({ heading }) => {
    return(
        <div>
            <p className="list-heading">{heading}</p>
        </div>
    )
}

MovieListHeading.propTypes = {
    heading: PropTypes.string.isRequired
}

export default MovieListHeading