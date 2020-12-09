/**
 * Format the date string
 * @param {string} date 
 */
function dateFormat(date) {
  let options = { year: 'numeric', month: 'short', day: '2-digit' };
  let _date  = new Date(date);
  return _date.toLocaleDateString("en-US", options)
}

/**
 * Format the currency string
 * @param {string} value 
 * @param {string} currency 
 */
function currencyFormat(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}