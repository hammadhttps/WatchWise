// 🔹 Basic Movie (used in lists like similar, upcoming)
export interface Movie {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  genre_ids?: number[]
}

// 🔹 Full Movie Details
export interface MovieDetails extends Movie {
  overview: string
  runtime: number
  genres: { id: number; name: string }[]
  tagline: string
  homepage: string
  status: string
  vote_count: number
  original_language: string
  budget: number
  revenue: number
  production_companies: { id: number; name: string }[]
}

// 🔹 Reviews
export interface Review {
  id: string
  author: string
  content: string
  created_at: string
  author_details: {
    username: string
    avatar_path: string | null
    rating: number | null
  }
}

// 🔹 Images
export interface MovieImages {
  id: number
  backdrops: {
    file_path: string
    aspect_ratio: number
    height: number
    width: number
    vote_average: number
    vote_count: number
    iso_639_1: string | null
  }[]
  posters: {
    file_path: string
    aspect_ratio: number
    height: number
    width: number
    vote_average: number
    vote_count: number
    iso_639_1: string | null
  }[]
  logos: {
    file_path: string
    aspect_ratio: number
    height: number
    width: number
    vote_average: number
    vote_count: number
    iso_639_1: string | null
  }[]
}

// 🔹 Videos (Trailers etc.)
export interface Video {
  id: string
  iso_639_1: string
  iso_3166_1: string
  key: string
  name: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
}

// 🔹 Watch Providers
export interface Provider {
  provider_id: number
  provider_name: string
  logo_path: string
  display_priority: number
}

export interface CountryProviders {
  link: string
  flatrate?: Provider[]
  rent?: Provider[]
  buy?: Provider[]
}

export interface WatchProviders {
  [countryCode: string]: CountryProviders | undefined
}

// 🔹 Aggregated Movie Data (Final UI Model)
export interface MovieFullData {
  details: MovieDetails
  reviews: Review[]
  images: MovieImages
  videos: Video[]
  similar: Movie[]
  providers: WatchProviders | null
}