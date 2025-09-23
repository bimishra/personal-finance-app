
export const CURRENCIES = ['INR', 'USD', 'GBP'] // add more as needed
export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  GBP: '£',
}

export const getCurrencySymbol = (currency: string) => {
  return CURRENCY_SYMBOLS[currency] || ''
}


export function formatCurrency(amount: number | string, currency: string, includeSymbol = false) {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  const symbol = getCurrencySymbol(currency)
  return `${includeSymbol ? symbol : ''}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}
