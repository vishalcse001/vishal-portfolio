import { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
   fetch('https://vishal-portfolio-j3gb.onrender.com/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  return (
    <section id="projects" className="py-20 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide mb-2">
          Projects
        </h2>
        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-12">
          Things I have Built
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Tilt key={project._id} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000}>
              <div
                className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 text-left shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 flex flex-col h-full hover-target"
              >
                {project.image && (
                  <div className="overflow-hidden rounded-md mb-4">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-48 object-cover transform hover:scale-110 transition duration-500" 
                    />
                  </div>
                )}

                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {project.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {project.techStack && project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mt-auto">
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="hover-target bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                      Live Demo
                    </a>
                  )}
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="hover-target border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;