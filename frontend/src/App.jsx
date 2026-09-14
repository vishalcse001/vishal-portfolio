import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FadeIn from './components/FadeIn'
import CustomCursor from './components/CustomCursor'
import Background from './components/Background'

function App() {
  return (
    <div className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white transition-colors duration-300 min-h-screen relative">
      <Background />
      <CustomCursor />
      <Navbar />
      <Hero />
      <FadeIn>
        <About />
      </FadeIn>
      <FadeIn>
        <Skills />
      </FadeIn>
      <FadeIn>
        <Projects />
      </FadeIn>
      <FadeIn>
        <Contact />
      </FadeIn>
      <Footer />
    </div>
  )
}

export default App