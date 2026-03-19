import { useEffect, useState } from "react";
import { getUpcomingMovies } from "../services/tmdb";
import type { Movie } from "../types/movie";


export const useUpcomingMovies = (category1:string) => {

const [movies, setMovies] = useState<Movie[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [category, setCategory] = useState("upcoming");

const loadMovies=async (pageNumber:number,category:string) => {
    try{
    const response = await getUpcomingMovies(pageNumber,category);
    setMovies(response.results);
    setTotalPages(response.total_pages);
    setPage(response.page);
    setCategory(category1);
    }
    catch(error){
        console.log(error);
    }
    setIsLoading(false);
}

useEffect(() => {
    loadMovies(page,category);
}, [page]);



return {
    movies,
    isLoading,
    page,
    totalPages,
    setPage,
    loadMovies
};




}
