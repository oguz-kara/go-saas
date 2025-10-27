import { Button } from '@gocrm/components/ui/button'
import { redirect } from 'next/navigation'
import { routes } from '@gocrm/lib/routes'

export default async function Home() {
  return redirect(routes.leads.list())

  return (
    <div>
      <Button>Hello again GoCRM</Button>
    </div>
  )
}
