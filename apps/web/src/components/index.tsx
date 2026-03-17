import Header from './Header/Header'
import Hero from './Hero/Hero'
import Features from './Features/Features'
import Stats from './Stats/Stats'
import Seamless from './Seamless/Seamless'
import Footer from './Footer/Footer'

export default function LandingPage() {
  return (
    <div className="bg-[#050A15] min-h-screen text-white">
      <Header />
      <Hero />
      <Features />
      <Stats />
      <Seamless />
      <Footer />
    </div>
  )
}