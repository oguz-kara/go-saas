import NextLink from 'next/link'

export default function Link({
  href,
  children,
  locale,
  className,
}: {
  href: string
  children: React.ReactNode
  locale?: string
  className?: string
}) {
  return (
    <NextLink href={href} locale={locale} className={className}>
      {children}
    </NextLink>
  )
}
