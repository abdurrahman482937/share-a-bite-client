import Hero from '../../components/Hero/Hero'
import FeaturedFoods from '../../components/FeaturedFoods/FeaturedFoods'
import Testimonial from '../../components/Testimonial/Testimonial'
import CallToAction from '../../components/CallToAction/CallToAction'

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedFoods />
      <Testimonial />
      <CallToAction />
    </div>
  )
}

export default Home