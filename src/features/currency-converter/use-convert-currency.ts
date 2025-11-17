import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'

import { getCurrencyApi } from '@/lib/api'

export type ConvertCurrencyRequest = {
  from: string
  to: string
  amount: string
}

const ConvertCurrencyResponseSchema = z.object({
  response: z.object({
    from: z.string(),
    to: z.string(),
    amount: z.number(),
    timestamp: z.number(),
    value: z.number()
  })
})

export type ConvertCurrencyResponse = z.infer<typeof ConvertCurrencyResponseSchema>

export const useConvertCurrency = () => {
  return useMutation({
    mutationFn: async (req: ConvertCurrencyRequest) => {
      try {
        const api = getCurrencyApi()
        const result = await api.convert(req)
        
        const validated = ConvertCurrencyResponseSchema.parse(result)

        return validated.response
      } catch (error) {
        console.log(error)
      }
    }
  })
}
