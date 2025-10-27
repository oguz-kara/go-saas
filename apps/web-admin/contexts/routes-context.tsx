'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { routes as defaultRoutes, Routes } from '../constants/routes'

interface IRoutesContext {
  routes: Routes | null
  isLoading: boolean
}

const RoutesContext = createContext<IRoutesContext | undefined>(undefined)

export const RoutesProvider = ({ children }: { children: ReactNode }) => {
  const [routes, setRoutes] = useState<Routes | null>(defaultRoutes)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadRoutes = async () => {
      setIsLoading(true)
      try {
        setTimeout(() => {
          setRoutes(defaultRoutes)
          setIsLoading(false)
        }, 200)
      } catch (error) {
        console.error('Failed to load routes:', error)
        setIsLoading(false)
      }
    }

    loadRoutes()
  }, [])

  const value = { routes, isLoading }

  if (isLoading) {
    return null
  }

  return (
    <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>
  )
}

// Hook'u context'i tüketmek için oluşturuyoruz
export const useRoutesContext = () => {
  const context = useContext(RoutesContext)
  if (context === undefined) {
    throw new Error('useRoutesContext must be used within a RoutesProvider')
  }
  return context
}
