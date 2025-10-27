'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { useTranslations } from '@/hooks/use-translations'

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
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const { translations } = useTranslations()

  const totalPages = Math.ceil(totalCount / pageSize)

  if (totalCount === 0 || !translations) {
    return null
  }

  const t = translations.pagination

  const createPageURL = (pageNumber: number, newPageSize?: number) => {
    const params = new URLSearchParams(searchParams)
    const skip = (pageNumber - 1) * (newPageSize || pageSize)
    params.set('skip', skip.toString())
    params.set('take', (newPageSize || pageSize).toString())
    return `${pathname}?${params.toString()}`
  }

  const goToPage = (pageNumber: number) => {
    replace(createPageURL(pageNumber))
  }

  const changePageSize = (newPageSize: number) => {
    replace(createPageURL(1, newPageSize))
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)

  return (
    <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      {/* Results count - Hidden on mobile, shown on tablet+ */}
      <div className="text-muted-foreground hidden text-sm sm:block sm:flex-1">
        {t.showingResults
          .replace('{{start}}', String(startItem))
          .replace('{{end}}', String(endItem))
          .replace('{{total}}', String(totalCount))}
      </div>

      {/* Mobile: Compact view */}
      <div className="flex items-center justify-between gap-2 sm:hidden">
        {/* Page info */}
        <div className="text-muted-foreground text-xs">
          {currentPage} / {totalPages}
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Page size selector */}
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => changePageSize(Number(value))}
        >
          <SelectTrigger className="h-7 w-[60px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 25, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tablet and Desktop: Full controls */}
      <div className="hidden items-center space-x-4 sm:flex lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">{t.rowsPerPage}</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => changePageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t.pageOf
            .replace('{{current}}', String(currentPage))
            .replace('{{total}}', String(totalPages))}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => goToPage(1)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">{t.goToFirstPage}</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">{t.previous}</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">{t.next}</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">{t.goToLastPage}</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
