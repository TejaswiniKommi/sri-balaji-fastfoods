import { useCallback, useEffect, useState } from 'react'
import { getFoodById } from '../services/foodService'

export default function useFoodDetails(id) {
  const [state, setState] = useState({ food: null, loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false
    setState({ food: null, loading: true, error: null })
    getFoodById(id)
      .then((food) => {
        if (!ignore) setState({ food, loading: false, error: null })
      })
      .catch((error) => {
        if (!ignore) setState({ food: null, loading: false, error })
      })
    return () => {
      ignore = true
    }
  }, [id, reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])
  return { ...state, reload }
}
