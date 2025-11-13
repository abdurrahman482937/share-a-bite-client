import { Outlet } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import { Toaster } from 'react-hot-toast'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import CardFood from './components/Card/Card'

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 120,
      easing: 'ease-in-out',
      mirror: false,
    })
  }, [])
  return (
    <div className='overflow-x-hidden'>
      <Header />
      <main className='min-h-screen'>
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </div>
  )
}

export default App