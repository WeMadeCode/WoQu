export interface EventSourceOptions {
  url: string
}

export interface EventSourceState<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
}
