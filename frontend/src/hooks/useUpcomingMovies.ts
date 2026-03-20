import { useEffect, useState } from "react";
import { getUpcomingMovies } from "../services/tmdb";
import type { Movie } from "../types/movie";


export const useUpcomingMovies = (category:string) => {

const [movies, setMovies] = useState<Movie[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const loadMovies=async (pageNumber:number) => {
    try{
    const response = await getUpcomingMovies(pageNumber,category);
    setMovies(response.results);
    setTotalPages(response.total_pages);
    setPage(response.page);
    }
    catch(error){
        console.log(error);
    }
    setIsLoading(false);
}

useEffect(() => {
    loadMovies(page);
}, [page,category]);



return {
    movies,
    isLoading,
    page,
    totalPages,
    setPage,
    loadMovies
};




}
