export interface AnimeImageSet {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface AnimeGenre {
  mal_id: number;
  name: string;
}

export interface AnimeProductionCredit {
  mal_id?: number;
  name: string;
}

export interface AnimeSummary {
  mal_id: number;
  url: string;
  title: string;
  title_english: string | null;
  images: {
    jpg: AnimeImageSet;
    webp: AnimeImageSet;
  };
  type: string;
  episodes: number | null;
  score: number | null;
  synopsis: string | null;
  rank: number | null;
  popularity: number | null;
  year: number | null;
  genres: AnimeGenre[];
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface AnimeTopResponse {
  data: AnimeSummary[];
  pagination: Pagination;
}

export interface AnimeAired {
  from: string | null;
  to: string | null;
  string: string | null;
}

export interface AnimeTrailer {
  youtube_id?: string;
  url?: string;
  embed_url?: string;
}

export interface AnimeDetail extends AnimeSummary {
  status: string;
  rating: string | null;
  airing: boolean;
  aired: AnimeAired;
  premiered: string | null;
  producers: AnimeProductionCredit[];
  studios: AnimeProductionCredit[];
  trailer?: AnimeTrailer | null;
  background: string | null;
}
