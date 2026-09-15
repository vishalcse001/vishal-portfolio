import { useState, useEffect } from 'react';

function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Naya switch banaya loading ke liye

  useEffect(() => {
    fetch('https://vishal-portfolio-j3gb.onrender.com/api/experience')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setExperiences(data);
        setIsLoading(false); // Data aate hi (chahe wo khali kyun na ho) loading band kar do
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false); // Agar koi error aaye tab bhi loading hata do
      });
  }, []);

  const getBadgeStyle = (category) => {
    if (category === 'Education') return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (category === 'Certification') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30'; 
  };

  return (
    <section id="experience" className="py-20 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          My <span className="text-blue-500">Timeline</span>
        </h2>

        <div className="relative border-l-4 border-blue-500 ml-3 md:ml-6">
          {/* Naya Logic: Pehle check karo ki Load ho raha hai ya nahi */}
          {isLoading ? (
            <p className="text-center text-gray-400 animate-pulse">Loading timeline from database...</p>
          ) : experiences.length === 0 ? (
            /* Load hone ke baad agar list khali hai toh ye dikhao */
            <p className="text-center text-gray-400 bg-gray-800 p-4 rounded-lg border border-gray-700">No timeline entries added yet. Go to Admin Panel to add your Education & Experience!</p>
          ) : (
            experiences.map((exp) => (
              <div key={exp._id} className="mb-12 ml-8 md:ml-12 relative group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[42px] md:-left-[58px] top-1 h-6 w-6 rounded-full border-4 border-gray-900 ${exp.current ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                
                {/* Content Card */}
                <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-700 hover:border-blue-500">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      {/* CATEGORY BADGE */}
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 border ${getBadgeStyle(exp.category)}`}>
                        {exp.category || "Experience"}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-100">{exp.role}</h3>
                      <h4 className="text-xl text-gray-400 font-semibold">{exp.company}</h4>
                    </div>
                    <div className="mt-3 md:mt-0 text-left md:text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-1 ${exp.current ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-300'}`}>
                        {exp.duration}
                      </span>
                      <p className="text-gray-400 text-sm mt-1">{exp.location}</p>
                    </div>
                  </div>

                  <ul className="list-disc ml-5 mt-4 text-gray-300 space-y-2">
                    {exp.description.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Experience;