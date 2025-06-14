import { Button } from '@gocrm/components/ui/button'
import { getRoutes } from '@gocrm/lib/i18n/get-routes'
import { redirect } from 'next/navigation'

export default async function Home() {
  const routes = await getRoutes()

  return redirect(routes.companies)

  return (
    <div>
      <Button>Hello again ShadcnUI</Button>
    </div>
  )
}
