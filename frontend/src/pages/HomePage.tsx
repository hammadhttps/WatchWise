import HeroSection from '../components/HeroSection'
import CardList from '../components/CardList'
import Footer from '../components/navigations/Footer'
import { useUpcomingMovies } from '../hooks/useUpcomingMovies'

// Picked once per page load so the hero stays stable across re-renders
const heroSeed = Math.random()

const HomePage = () => {
  const { movies } = useUpcomingMovies("upcoming")
  const heroMovie = movies[Math.floor(heroSeed * movies.length)]

  return (
    <div className=' bg-[#F5F2F2]'>
        <HeroSection 
          heroImage={heroMovie ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}` : ''}
          title={heroMovie?.title}
          description={heroMovie?.overview}
          rating={heroMovie?.vote_average?.toFixed(1)}
          year={heroMovie?.release_date?.split('-')[0]}
        />
        <CardList title="Coming Soon" Category1="upcoming" heading="Upcoming Movies"/>
        
        <Footer/>
    </div>
  )
}

export default HomePage