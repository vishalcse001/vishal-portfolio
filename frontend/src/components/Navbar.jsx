import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

function Navbar() {
  const [activeSection, setActiveSection] = useState('home')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'projects', 'contact']

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150

      for (const id of sections) {
        const element = document.getElementById(id)
        if (element) {
          const top = element.offsetTop
          const bottom = top + element.offsetHeight

          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Vishal <span className="text-blue-600">Yadav</span>
        </h1>

        <div className="flex items-center gap-8">
          <ul className="flex gap-8 font-medium">
            {navLinks.map((link) => (
              <li key={link.id} className="relative py-1">
                <a
                  href={`#${link.id}`}
                  className={`transition-colors ${
                    activeSection === link.id
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </a>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 ${
                    activeSection === link.id ? 'w-full' : 'w-0'
                  }`}
                ></span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar