'use client'

import { useRoutesContext } from '@gocrm/contexts/routes-context'

export const useRoutes = () => {
  const { routes, isLoading } = useRoutesContext()
  return { routes, isLoading }
}
