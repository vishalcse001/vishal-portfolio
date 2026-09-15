import { useState, useEffect } from 'react';

function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('https://vishal-portfolio-j3gb.onrender.com');
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://vishal-portfolio-j3gb.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
        fetchProjects();
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    const formattedData = {
      ...formData,
      techStack: formData.techStack.split(',').map(tech => tech.trim())
    };

    try {
      const response = await fetch('https://vishal-portfolio-j3gb.onrender.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formattedData)
      });

      if (response.ok) {
        alert("Project Added Successfully!");
        setFormData({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' });
        fetchProjects();
      } else {
        alert("Failed to add project");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('adminToken');
    if(window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`https://vishal-portfolio-j3gb.onrender.com/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          fetchProjects(); 
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  const inputStyles = "p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500";

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyles} required />
            <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600">Logout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-6 rounded-lg shadow-md h-fit border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Add New Project</h2>
          <form onSubmit={handleAddProject} className="flex flex-col gap-3">
            <input type="text" placeholder="Project Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputStyles} required />
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputStyles} h-24 resize-none`} required />
            <input type="text" placeholder="Tech Stack (e.g. React, Node, MongoDB)" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} className={inputStyles} required />
            <input type="text" placeholder="GitHub Link" value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} className={inputStyles} />
            <input type="text" placeholder="Live Demo Link" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} className={inputStyles} />
            <input type="text" placeholder="Image Name (e.g. /project.jpg)" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className={inputStyles} />
            <button type="submit" className="mt-2 bg-green-500 text-white font-bold py-3 rounded hover:bg-green-600">Add Project</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Manage Projects</h2>
          <div className="flex flex-col gap-4">
            {projects.map(project => (
              <div key={project._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.techStack.join(', ')}</p>
                </div>
                <button onClick={() => handleDelete(project._id)} className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">
                  Delete
                </button>
              </div>
            ))}
            {projects.length === 0 && <p className="text-gray-500">No projects found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;