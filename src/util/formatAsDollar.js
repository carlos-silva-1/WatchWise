function formatAsDollarAmount(numberStr) {
    const number = parseInt(numberStr, 10);
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(number);
    return formattedAmount;
}

export default formatAsDollarAmount