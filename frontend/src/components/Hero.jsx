function Hero() {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <h2 className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-2">
        Hi, I'm
      </h2>
      <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
        Vishal Yadav
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        Full Stack Developer & AI/ML Enthusiast — 
        Building intelligent, scalable, and fast web applications.
      </p>
      <div className="flex gap-4">
        <a
          href="#projects"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-blue-200 dark:shadow-blue-900/50 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          View Projects
        </a>
        <a
          href="/Vishal_Yadav_Resume.pdf"
          download
          className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-gray-800 hover:-translate-y-0.5 transition-all"
        >
          Download Resume
        </a>
      </div>
    </section>
  )
}

export default Hero