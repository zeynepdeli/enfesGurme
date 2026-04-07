import { UseQueryResult } from '@tanstack/react-query'

interface QueryStatesProps<T> {
  query: UseQueryResult<T, Error>
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  emptyCheck?: (data: T | undefined) => boolean
  emptyComponent?: React.ReactNode
}

export function useQueryStates<T>({
  query,
  loadingComponent,
  errorComponent,
  emptyCheck,
  emptyComponent
}: QueryStatesProps<T>) {
  const { data, isLoading, error, refetch } = query

  // Loading state
  if (isLoading && loadingComponent) {
    return {
      component: loadingComponent,
      data: undefined,
      showContent: false
    }
  }

  // Error state
  if (error && errorComponent) {
    return {
      component: errorComponent,
      data: undefined,
      showContent: false
    }
  }

  // Empty state
  if (emptyCheck && emptyCheck(data) && emptyComponent) {
    return {
      component: emptyComponent,
      data,
      showContent: false
    }
  }

  // Success state
  return {
    component: null,
    data,
    showContent: true,
    refetch
  }
}
