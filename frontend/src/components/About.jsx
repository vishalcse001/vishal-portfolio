function About() {
  return (
    <section id="about" className="py-20 px-6 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide mb-2">
          About Me
        </h2>
        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          A little about my journey
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
          I'm a Full Stack Developer who loves turning ideas into working
          products. My journey started with learning the basics of web
          development, and it quickly grew into a passion for building
          real applications — from AI-powered tools to full-stack platforms.
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
          I enjoy working across the stack — designing clean interfaces
          on the frontend and building solid, scalable logic on the backend.
          I'm always learning new tools and technologies to write better,
          more efficient code.
        </p>
      </div>
    </section>
  )
}

export default About