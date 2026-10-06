import { useCallback, useEffect, useState } from 'react'
import { getFoods } from '../services/foodService'

/** Loads the menu. Components get { foods, loading, error, reload } and never touch the API directly. */
export default function useFoods() {
  const [state, setState] = useState({ foods: [], loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false
    setState((s) => ({ ...s, loading: true, error: null }))
    getFoods()
      .then((foods) => {
        if (!ignore) setState({ foods, loading: false, error: null })
      })
      .catch((error) => {
        if (!ignore) setState((s) => ({ ...s, loading: false, error }))
      })
    return () => {
      ignore = true
    }
  }, [reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])
  return { ...state, reload }
}
