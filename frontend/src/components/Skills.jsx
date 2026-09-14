import { LayoutTemplate, Server, Sparkles, Database, Wrench } from 'lucide-react';

function Skills() {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <LayoutTemplate className="w-8 h-8 text-blue-500" />,
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    },
    {
      title: "Backend Architecture",
      icon: <Server className="w-8 h-8 text-purple-500" />,
      skills: ["Node.js", "Express.js", "REST APIs", "GraphQL"],
    },
    {
      title: "AI & Machine Learning",
      icon: <Sparkles className="w-8 h-8 text-emerald-500" />,
      skills: ["Gemini API", "Prompt Engineering", "LLM Integration", "LangChain"],
    },
    {
      title: "Database Management",
      icon: <Database className="w-8 h-8 text-orange-500" />,
      skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
    },
    {
      title: "DevOps & Tools",
      icon: <Wrench className="w-8 h-8 text-rose-500" />,
      skills: ["Git", "Docker", "AWS", "CI/CD", "Postman"],
    },
  ]

  return (
    <section id="skills" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-widest mb-3">
            Expertise
          </h2>
          <h3 className="text-4xl font-extrabold text-slate-800 dark:text-white">
            Technical Arsenal
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="group bg-white dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 hover-target"
            >
              <div className="bg-slate-50 dark:bg-slate-900/50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                {category.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span key={skill} className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-sm font-medium px-3 py-1.5 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills