import HeroSection from '../components/HeroSection'
import heroImageUrl from '../assets/heroImage.jpg'

const HomePage = () => {
  return (
    <div>
        <HeroSection heroImage={heroImageUrl}/>
    </div>
  )
}

export default HomePage