import HeroSection from '../components/HeroSection'
import CardList from '../components/CardList'
import Footer from '../components/Footer'
import { useUpcomingMovies } from '../hooks/useUpcomingMovies'

const HomePage = () => {
  const { movies } = useUpcomingMovies("upcoming")
  const randomMovie = Math.floor(Math.random() * movies.length)
  const heroMovie = movies[randomMovie]

  return (
    <div className=' bg-[#F5F2F2]'>
        <HeroSection 
          heroImage={heroMovie ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}` : ''}
          title={heroMovie?.title}
          description={heroMovie?.overview}
          rating={heroMovie?.vote_average?.toFixed(1)}
          year={heroMovie?.release_date?.split('-')[0]}
        />
        <CardList title="Coming Soon" Category1="Upcoming Movies"/>
        
        <Footer/>
    </div>
  )
}

export default HomePage