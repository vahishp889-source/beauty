// Price formatting utility - Indian Rupees
export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

// Convert USD to INR (example rate)
export function convertToINR(usdPrice) {
  const exchangeRate = 83.5; // 1 USD = 83.5 INR
  return Math.round(usdPrice * exchangeRate);
}

// Format number with commas for INR
export function formatINR(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
}
