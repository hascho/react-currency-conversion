import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'

const CurrencyListItem = z.object({
  id: z.number(),
  name: z.string(),
  short_code: z.string(),
  code: z.string(),
  decimal_mark: z.string(),
  precision: z.number(),
  subunit: z.number(),
  symbol: z.string(),
  symbol_first: z.boolean(),
  thousands_separator: z.string()
})

const CurrenciesListResponseSchema = z.object({
  response: z.array(CurrencyListItem)
})

export type CurrencyListItem = z.infer<typeof CurrencyListItem>
export type CurrenciesListResponse = z.infer<typeof CurrenciesListResponseSchema>

import { getCurrencyApi } from '@/lib/api'

export const useCurrenciesList = () => {
  return useQuery({
    queryKey: ['currencies', 'list'],
    queryFn: async () => {
      try {
        const api = getCurrencyApi()
        const result = await api.getCurrencies()
        
        const validated = CurrenciesListResponseSchema.parse(result)
        
        return validated.response
      } catch (error) {
        console.log(error)
      }
    }
  })
}
