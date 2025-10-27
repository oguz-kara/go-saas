'use client'

import { useRoutesContext } from '@/contexts/routes-context'

export const useRoutes = () => {
  const { routes, isLoading } = useRoutesContext()
  return { routes, isLoading }
}
