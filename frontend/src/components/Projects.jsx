function Projects() {
  const projects = [
    {
      name: "SmartResume AI",
      description:
        "An AI-powered resume analyzer that uses Google's Gemini API to review resumes, highlight strengths and gaps, and suggest improvements, helping users build stronger, ATS-friendly resumes.",
      tech: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Gemini API"],
      liveLink: "https://resume-analyzer-with-gemini-ai.vercel.app",
      githubLink: "https://github.com/vishalcse001/Resume-analyzer-with-Gemini-AI",
    },
    {
      name: "SecureMeet",
      description:
        "A real-time video conferencing platform inspired by Zoom, featuring multi-participant video calls, live screen sharing, secure room generation, and smooth audio and video controls built on WebRTC.",
      tech: ["React", "Node.js", "Express", "WebRTC", "Socket.io", "PeerJS"],
      liveLink: "https://secure-zoom-clone.vercel.app",
      githubLink: "https://github.com/vishalcse001/secure-zoom-clone",
    },
  ]

  return (
    <section id="projects" className="py-20 px-6 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide mb-2">
          Projects
        </h2>
        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-12">
          Things I have Built
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.name}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-left shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {project.name}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  Live Demo
                </a>
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects