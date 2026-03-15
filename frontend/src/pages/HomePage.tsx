import HeroSection from '../components/HeroSection'
import heroImageUrl from '../assets/heroImage.jpg'
import CardList from '../components/CardList'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <div className=' bg-[#F5F2F2]'>
        <HeroSection heroImage={heroImageUrl}/>
        <CardList/>
        <CardList/>
        <CardList/>
        <Footer/>
    </div>
  )
}

export default HomePage