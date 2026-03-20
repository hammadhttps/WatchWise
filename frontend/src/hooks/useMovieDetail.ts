// hooks/useMovie.ts
import { useEffect, useState } from "react"
import { fetchMovieFullData } from "../services/movie_detail"
import type { MovieFullData } from "../types/movieDetails"

export const useMovieDetail = (id: number) => { 
  const [data, setData] = useState<MovieFullData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetchMovieFullData(id)
        setData(res)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }

    load()
  }, [id])

  return { data, loading }
}