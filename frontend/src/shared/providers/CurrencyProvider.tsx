import { createContext, useContext, useState, ReactNode } from 'react'

export type CurrencyType = 'BTC' | 'LTC'

interface CurrencyContextType {
  currency: CurrencyType
  setCurrency: (currency: CurrencyType) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const CURRENCY_STORAGE_KEY = 'selected-currency'
const DEFAULT_CURRENCY: CurrencyType = 'BTC'

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyType>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY)
      if (saved === 'BTC' || saved === 'LTC') {
        return saved as CurrencyType
      }
    } catch (error) {
      console.error('Error loading currency:', error)
    }
    return DEFAULT_CURRENCY
  })

  const setCurrency = (newCurrency: CurrencyType) => {
    console.log('Global setCurrency:', newCurrency)
    setCurrencyState(newCurrency)
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}