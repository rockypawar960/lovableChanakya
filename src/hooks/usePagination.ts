import { useState, useCallback } from 'react'

interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface UsePaginationReturn extends PaginationState {
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  setLimit: (limit: number) => void
  setTotal: (total: number) => void // ✅ added
  reset: () => void
}

export const usePagination = (initialLimit = 20): UsePaginationReturn => {
  const [page, setPage] = useState(1)
  const [limit, setLimitState] = useState(initialLimit)
  const [total, setTotal] = useState(0)

  const totalPages = Math.ceil(total / limit)

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(page + 1)
  }, [page, goToPage])

  const prevPage = useCallback(() => {
    goToPage(page - 1)
  }, [page, goToPage])

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit)
    setPage(1)
  }, [])

  const reset = useCallback(() => {
    setPage(1)
    setTotal(0)
  }, [])

  return {
    page,
    limit,
    total,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    setLimit,
    setTotal, // ✅ IMPORTANT
    reset,
  }
}