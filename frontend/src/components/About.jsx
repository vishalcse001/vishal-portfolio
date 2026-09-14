import { Terminal, Code, Cpu } from 'lucide-react';

function About() {
  return (
    <section id="about" className="py-24 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-widest mb-3">
              About Me
            </h2>
            <h3 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-6 leading-tight">
              Engineering solutions <br className="hidden lg:block"/> with code and logic.
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6">
              I'm a Full Stack Developer who loves turning complex problems into elegant, scalable solutions. My journey started with the fundamentals of web development, evolving into a deep passion for building intelligent systems and robust platforms.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              Whether designing clean, intuitive interfaces on the frontend or architecting solid, high-performance logic on the backend, I thrive on continuous learning and pushing the boundaries of what code can achieve.
            </p>
          </div>
          
          <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-xl hover-target">
              <Terminal className="w-10 h-10 text-blue-500 mb-4" />
              <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Frontend</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Crafting responsive, accessible, and performant user interfaces.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-xl hover-target sm:translate-y-8">
              <Code className="w-10 h-10 text-purple-500 mb-4" />
              <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Backend</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Architecting secure APIs and managing efficient databases.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-xl hover-target sm:-mt-8">
              <Cpu className="w-10 h-10 text-emerald-500 mb-4" />
              <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">AI Integration</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Building smart tools using the latest in machine learning models.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About