import { useState, useCallback, memo } from 'react'

import { Input } from '@/components/input'

import { CurrencySelect } from './currency-select'
import type { CurrencyListItem } from './use-currencies-list'
import { useCurrenciesList } from './use-currencies-list'
import { Button } from '@/components/button'
import { useConvertCurrency } from './use-convert-currency'

const showMaxHistoryItems = 5

const parseAmount = (value: string) => {
  return value
    .replace(/[^0-9.]/g, '')
    .replace(/(\..*?)\..*/g, '$1')
}

type CurrencyInputProps = {
  onSelectCurrency: (value: string) => void
  selectedCurrency: string
  onChangeAmount: (value: string) => void
  amount: string
  currencies: CurrencyListItem[]
  inputPlaceholder: string
}

const CurrencyInput = memo((props: CurrencyInputProps) => {
  const {
    onSelectCurrency,
    selectedCurrency,
    onChangeAmount,
    amount,
    currencies,
    inputPlaceholder
  } = props

  return (
    <div className='flex gap-2'>
      <Input
        value={amount}
        onChange={e => onChangeAmount(e.target.value)}
        placeholder={inputPlaceholder}
      />
      <CurrencySelect
        onValueChange={onSelectCurrency}
        value={selectedCurrency}
        currencies={currencies}
      />
    </div>
  )
})

const defaultState = {
  code: '',
  amount: ''
}

type HistoryType = {
  from: string
  to: string
  amount: string
  convertedAmount: string
  createdAt: Date
}

export const CurrencyConverter = () => {
  const { data: currencies, isError: isCurrenciesError } = useCurrenciesList()
  const { mutateAsync: convertCurrency, isPending, isError: isConvertError } = useConvertCurrency()

  const [fromCurrency, setFromCurrency] = useState(defaultState)
  const [toCurrency, setToCurrency] = useState(defaultState)
  const [history, setHistory] = useState<HistoryType[]>([])

  const fieldsValid = !!fromCurrency.code
    && fromCurrency.amount.length > 0
    && !!toCurrency.code
  const convertDisabled = isPending || !fieldsValid

  const handleSelectCurrencyCode = (type: 'from' | 'to') => {
    return (value: string) => {
      if (type === 'from') {
        setFromCurrency(from => ({ ...from, code: value }))
      } else {
        setToCurrency(to => ({ ...to, code: value }))
      }
    }
  }
  const handleSelectFromCurrency = useCallback(handleSelectCurrencyCode('from'), [])
  const handleSelectToCurrency = useCallback(handleSelectCurrencyCode('to'), [])

  const handleAmountChange = (type: 'from' | 'to') => {
    return (value: string) => {
      const parsed = parseAmount(value)
      if (type === 'from') {
        setFromCurrency(from => ({ ...from, amount: parsed }))
      } else {
        setToCurrency(to => ({ ...to, amount: parsed }))
      }
    }
  }
  const handleFromAmountChange = useCallback(handleAmountChange('from'), [])
  const handleToAmountChange = useCallback(handleAmountChange('to'), [])

  const handleConvertCurrency = async () => {
    if (convertDisabled) return

    const result = await convertCurrency({
      from: fromCurrency.code,
      to: toCurrency.code,
      amount: fromCurrency.amount
    })

    if (!result) return
    
    if (
      fromCurrency.code === result.from &&
      Number(fromCurrency.amount) === result.amount &&
      toCurrency.code === result.to
    ) {
      handleToAmountChange(result.value.toFixed(2))
      const newItem = {
        from: fromCurrency.code,
        to: toCurrency.code,
        amount: fromCurrency.amount,
        convertedAmount: result.value.toFixed(2),
        createdAt: new Date()
      }
      setHistory(history => [...[newItem, ...history].slice(0, showMaxHistoryItems)])
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <h1>Currency Convertor</h1>

      <div className='flex flex-col gap-2'>
        <CurrencyInput
          selectedCurrency={fromCurrency.code}
          onSelectCurrency={handleSelectFromCurrency}
          amount={fromCurrency.amount}
          onChangeAmount={handleFromAmountChange}
          currencies={currencies ?? []}
          inputPlaceholder='From'
        />
        <CurrencyInput
          selectedCurrency={toCurrency.code}
          onSelectCurrency={handleSelectToCurrency}
          amount={toCurrency.amount}
          onChangeAmount={handleToAmountChange}
          currencies={currencies ?? []}
          inputPlaceholder='To'
        />
      </div>

      <div className='flex justify-end'>
        <Button onClick={handleConvertCurrency} disabled={convertDisabled}>
          Convert
        </Button>
      </div>

      {isCurrenciesError && <p className='text-red'>Could not load currencies!</p>}
      {isConvertError && <p className='text-red'>Could not convert!</p>}

      <ul>
        {history.map(item => (
          <li key={`item::${item.createdAt}`}>
            from: {item.from}; to: {item.to}; amount: {item.amount}; convertedAmount: {item.convertedAmount}
          </li>
        ))}
      </ul>
    </div>
  )
}
