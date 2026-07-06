function Skills() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"],
    },
    {
      title: "Backend",
      skills: ["Node.js", "Express.js", "REST APIs"],
    },
    {
      title: "AI/ML",
      skills: ["Gemini API", "Prompt Engineering", "AI Integration"],
    },
    {
      title: "Database",
      skills: ["MongoDB", "MySQL"],
    },
    {
      title: "Tools",
      skills: ["Git", "GitHub", "VS Code", "Postman"],
    },
  ]

  return (
    <section id="skills" className="py-20 px-6 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide mb-2">
          Skills
        </h2>
        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-12">
          Technologies I Work With
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {category.title}
              </h4>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill} className="text-gray-600 dark:text-gray-300 text-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills