const stringToDate = (dateString) => {
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Adjust month by -1
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
}

export default stringToDate
