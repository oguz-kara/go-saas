import 'server-only'
import { Routes, routes } from '@gocrm/constants/routes'

export const getRoutes = async (): Promise<Routes> => {
  await Promise.resolve()

  return routes
}
