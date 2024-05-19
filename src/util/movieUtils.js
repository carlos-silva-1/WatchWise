const isMovie = (item) => {
	if("release_date" in item)
		return true
	return false
}

const isSeries = (item) => {
	if("first_air_date" in item)
		return true
	return false
}

const isPerson = (item) => {
	if("gender" in item)
		return true
	return false
}

export { isMovie, isSeries, isPerson }