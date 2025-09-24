import { clsx } from 'clsx'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | string)[] = []

    if (totalPages === 1) {
      // Если всего 1 страница, показываем только её
      pages.push(1)
    } else if (totalPages <= 5) {
      // Если 5 или меньше страниц, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Для больше 5 страниц: показываем 1, 2, 3, ..., последняя
      pages.push(1, 2, 3, '...', totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()
  const canGoPrevious = currentPage > 1 && totalPages > 1
  const canGoNext = currentPage < totalPages && totalPages > 1

  return (
    <div className={clsx(
      'flex items-center justify-between py-4',
      className
    )}>
      {/* Номера страниц - слева */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="w-8 h-8 flex items-center justify-center text-text-muted text-sm">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={clsx(
                  'w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-all duration-200 relative overflow-hidden',
                  currentPage === page
                    ? 'text-accent-green bg-black shadow-[inset_0_0_8px_rgba(0,255,38,0.4)]'
                    : 'text-text-muted hover:text-text-primary bg-black hover:shadow-[inset_0_0_6px_rgba(0,255,38,0.2)]'
                )}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Стрелки навигации - справа */}
      <div className="flex items-center gap-2">
        {/* Кнопка назад */}
        <button
          onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className={clsx(
            'w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 relative overflow-hidden',
            canGoPrevious
              ? 'text-accent-green bg-black shadow-[inset_0_0_8px_rgba(0,255,38,0.4)] hover:shadow-[inset_0_0_12px_rgba(0,255,38,0.6)] cursor-pointer'
              : 'text-text-muted bg-black cursor-not-allowed opacity-50'
          )}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Кнопка вперед */}
        <button
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={clsx(
            'w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 relative overflow-hidden',
            canGoNext
              ? 'text-accent-green bg-black shadow-[inset_0_0_8px_rgba(0,255,38,0.4)] hover:shadow-[inset_0_0_12px_rgba(0,255,38,0.6)] cursor-pointer'
              : 'text-text-muted bg-black cursor-not-allowed opacity-50'
          )}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}