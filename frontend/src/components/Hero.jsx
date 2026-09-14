import { motion } from 'framer-motion';

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-transparent transition-colors overflow-hidden relative">
      <motion.div 
        className="z-10 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 variants={itemVariants} className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-2 tracking-widest uppercase">
          Hi, I'm
        </motion.h2>
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-gray-800 dark:text-white mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Vishal Yadav
        </motion.h1>
        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
          Full Stack Developer & AI/ML Enthusiast — <br className="hidden md:block" />
          Building intelligent, scalable, and fast web applications.
        </motion.p>
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
          <a
            href="#projects"
            className="hover-target bg-blue-600 text-white px-8 py-4 rounded-full font-medium shadow-lg shadow-blue-200 dark:shadow-blue-900/50 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            View Projects
          </a>
          <a
            href="/Vishal_Yadav_Resume.pdf"
            download
            className="hover-target border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-full font-medium hover:bg-blue-50 dark:hover:bg-slate-800 hover:-translate-y-1 transition-all"
          >
            Download Resume
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero