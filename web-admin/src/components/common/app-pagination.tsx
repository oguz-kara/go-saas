// src/components/common/app-pagination.tsx
'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@gocrm/components/ui/pagination'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTranslations } from '@gocrm/hooks/use-translations'

interface AppPaginationProps {
  totalCount: number
  pageSize: number
  currentPage: number
}

export const AppPagination = ({
  totalCount,
  pageSize,
  currentPage,
}: AppPaginationProps) => {
  const { translations } = useTranslations()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = translations?.pagination

  const totalPages = Math.ceil(totalCount / pageSize)

  if (totalPages <= 1 || !t) {
    return null // Eğer sadece bir sayfa varsa veya çeviriler yüklenmediyse paginasyonu gösterme
  }

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams)
    const skip = (pageNumber - 1) * pageSize
    params.set('skip', skip.toString())
    params.set('take', pageSize.toString())
    return `${pathname}?${params.toString()}`
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    // Her zaman gösterilecekler: 1. sayfa, son sayfa, mevcut sayfa ve komşuları
    const shownPages = new Set([
      1,
      totalPages,
      currentPage,
      currentPage - 1,
      currentPage + 1,
    ])

    let lastShownPage = 0
    for (let i = 1; i <= totalPages; i++) {
      if (shownPages.has(i)) {
        if (i > lastShownPage + 1) {
          pageNumbers.push('...') // Arada boşluk varsa ... ekle
        }
        pageNumbers.push(i)
        lastShownPage = i
      }
    }
    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={
              currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined
            }
          >
            {t.previous}
          </PaginationPrevious>
        </PaginationItem>

        {pageNumbers.map((page, index) =>
          typeof page === 'number' ? (
            <PaginationItem key={`${page}-${index}`}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={`${page}-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            className={
              currentPage >= totalPages
                ? 'pointer-events-none opacity-50'
                : undefined
            }
          >
            {t.next}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
