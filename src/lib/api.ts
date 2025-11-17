import type { ConvertCurrencyRequest, ConvertCurrencyResponse } from "@/features/currency-converter/use-convert-currency"
import type { CurrenciesListResponse } from "@/features/currency-converter/use-currencies-list"

const apiKey = 'api_key_here'

const defaultHeaders = {
  'Content-Type': 'application/json'
}

const getAuthorizationHeader = (token: string) => ({
  Authorization: `Bearer ${token}`
})

const getHeaders = ({ token }: { token: string }) => ({
  ...defaultHeaders,
  ...getAuthorizationHeader(token)
})

const getCurrencies = async (): Promise<CurrenciesListResponse> => {
  const res = await fetch('https://api.currencybeacon.com/v1/currencies', {
    headers: getHeaders({ token: apiKey })
  })
  return await res.json()
}

const convertCurrency = async (req: ConvertCurrencyRequest): Promise<ConvertCurrencyResponse> => {
  const params = new URLSearchParams({
    from: req.from,
    to: req.to,
    amount: req.amount
  }).toString()
  const url = `https://api.currencybeacon.com/v1/convert?${params}`
  const res = await fetch(url, {
    headers: getHeaders({ token: apiKey })
  })
  return await res.json()
}

export const getCurrencyApi = () => {
  return {
    getCurrencies,
    convert: convertCurrency
  }
}
