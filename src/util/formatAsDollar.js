function formatAsDollarAmount(numberStr) {
    // Convert string to number
    const number = parseInt(numberStr, 10);
    // Format as dollar amount
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(number);
    return formattedAmount;
}

export default formatAsDollarAmount