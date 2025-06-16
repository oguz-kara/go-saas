import Header from '@gocrm/components/layout/header'

export default function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-2 md:p-3 lg:p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
