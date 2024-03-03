function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'; // Append ellipsis (...) at the end
  } else {
    return text;
  }
}

export default truncateText