import HeroSection from '../components/HeroSection'
import CardList from '../components/CardList'
import Footer from '../components/Footer'
import { useUpcomingMovies } from '../hooks/useUpcomingMovies'

const HomePage = () => {
  const { movies } = useUpcomingMovies()
  const heroMovie = movies[0]

  return (
    <div className=' bg-[#F5F2F2]'>
        <HeroSection 
          heroImage={heroMovie ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}` : ''}
          title={heroMovie?.title}
          description={heroMovie?.overview}
          rating={heroMovie?.vote_average?.toFixed(1)}
          year={heroMovie?.release_date?.split('-')[0]}
        />
        <CardList />
        
        <Footer/>
    </div>
  )
}

export default HomePage