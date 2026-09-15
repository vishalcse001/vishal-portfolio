import { useState, useEffect } from 'react';

function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('projects'); 
  
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [messages, setMessages] = useState([]); 
  
  const [formData, setFormData] = useState({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' });
  const [expFormData, setExpFormData] = useState({ category: 'Experience', role: '', company: '', duration: '', location: '', current: false, description: '' });
  
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const API_URL = 'https://vishal-portfolio-j3gb.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      const projRes = await fetch(`${API_URL}/api/projects`);
      const projData = await projRes.json();
      if (Array.isArray(projData)) setProjects(projData);

      const expRes = await fetch(`${API_URL}/api/experience`);
      const expData = await expRes.json();
      if (Array.isArray(expData)) setExperiences(expData);

      if (token) {
        const msgRes = await fetch(`${API_URL}/api/messages`, { headers });
        const msgData = await msgRes.json();
        if (Array.isArray(msgData)) setMessages(msgData);
      }
    } catch (err) { console.error(err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
        fetchData();
      } else { alert(data.message || "Login failed!"); }
    } catch (error) { console.error(error); }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const formattedData = { ...formData, techStack: formData.techStack.split(',').map(tech => tech.trim()) };
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formattedData)
      });
      if (response.ok) { alert("Project Added!"); setFormData({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' }); fetchData(); }
    } catch (err) { console.error(err); }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const formattedData = { ...expFormData, description: expFormData.description.split('\n').filter(d => d.trim() !== '') };
    try {
      const response = await fetch(`${API_URL}/api/experience`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formattedData)
      });
      if (response.ok) { alert(`${expFormData.category} Added!`); setExpFormData({ category: 'Experience', role: '', company: '', duration: '', location: '', current: false, description: '' }); fetchData(); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (type, id) => {
    const token = localStorage.getItem('adminToken');
    if(window.confirm(`Are you sure you want to delete this?`)) {
      try {
        const response = await fetch(`${API_URL}/api/${type}/${id}`, {
          method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) fetchData();
      } catch (err) { console.error(err); }
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_URL}/api/messages/reply/${replyingTo._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ replyText })
      });
      if (response.ok) {
        alert("Reply Sent to User's Email Successfully!");
        setReplyingTo(null);
        setReplyText('');
        fetchData(); 
      } else { alert("Failed to send reply"); }
    } catch (err) { console.error(err); }
  };

  // Modern UI Styles
  const inputStyles = "w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-100 placeholder-gray-500 transition-all";
  const cardStyles = "bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700";
  const btnPrimary = "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5";

  // ===================== LOGIN UI =====================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a] px-4 font-sans relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        
        <div className="bg-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-800 w-full max-w-md z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Admin Portal</h2>
            <p className="text-gray-400 mt-2 text-sm">Secure access for Vishal Yadav</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="text-sm text-gray-400 font-semibold mb-1 block">Email Address</label>
              <input type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} required />
            </div>
            <div>
              <label className="text-sm text-gray-400 font-semibold mb-1 block">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyles} required />
            </div>
            <button type="submit" className={`${btnPrimary} mt-2`}>Secure Login</button>
          </form>
        </div>
      </div>
    );
  }

  // ===================== DASHBOARD UI =====================
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-gray-100 font-sans pb-10">
      {/* Top Navbar */}
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-wide">
            Workspace
          </h1>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <button onClick={() => setActiveTab('projects')} className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'projects' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>🚀 Projects</button>
            <button onClick={() => setActiveTab('experience')} className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'experience' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>🎓 Timeline</button>
            <button onClick={() => setActiveTab('messages')} className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${activeTab === 'messages' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              📬 Inbox 
              {messages.filter(m => !m.replied).length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{messages.filter(m => !m.replied).length}</span>
              )}
            </button>
            <button onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 px-5 py-2 rounded-lg text-sm font-semibold transition-all ml-2">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        
        {/* ===================== PROJECTS TAB ===================== */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-5 space-y-6">
              <div className={cardStyles}>
                <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2"><span className="w-2 h-6 bg-blue-500 rounded-full"></span> Add New Project</h2>
                <form onSubmit={handleAddProject} className="flex flex-col gap-4">
                  <input type="text" placeholder="Project Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputStyles} required />
                  <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputStyles} h-28 resize-none`} required />
                  <input type="text" placeholder="Tech Stack (HTML, CSS, JS)" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} className={inputStyles} required />
                  <div className="flex gap-4">
                    <input type="text" placeholder="GitHub Link" value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} className={inputStyles} />
                    <input type="text" placeholder="Live Demo Link" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} className={inputStyles} />
                  </div>
                  <button type="submit" className={`${btnPrimary} mt-2`}>Publish Project</button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className={cardStyles}>
                <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2"><span className="w-2 h-6 bg-indigo-500 rounded-full"></span> Active Projects</h2>
                <div className="flex flex-col gap-3">
                  {projects.map(project => (
                    <div key={project._id} className="group border border-gray-700 bg-gray-900/50 p-4 rounded-xl flex justify-between items-center hover:border-blue-500/50 transition-all">
                      <div>
                        <h3 className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{project.techStack.join(' • ')}</p>
                      </div>
                      <button onClick={() => handleDelete('projects', project._id)} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Delete</button>
                    </div>
                  ))}
                  {projects.length === 0 && <p className="text-center text-gray-500 py-10">No projects deployed yet.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TIMELINE TAB ===================== */}
        {activeTab === 'experience' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-5 space-y-6">
              <div className={cardStyles}>
                <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2"><span className="w-2 h-6 bg-indigo-500 rounded-full"></span> Add Record</h2>
                <form onSubmit={handleAddExperience} className="flex flex-col gap-4">
                  <select value={expFormData.category} onChange={e => setExpFormData({...expFormData, category: e.target.value})} className={`${inputStyles} cursor-pointer appearance-none`} required>
                    <option value="Experience">Work Experience</option><option value="Education">Education</option><option value="Certification">Certification</option>
                  </select>
                  <input type="text" placeholder="Role / Degree (e.g., MERN Intern)" value={expFormData.role} onChange={e => setExpFormData({...expFormData, role: e.target.value})} className={inputStyles} required />
                  <input type="text" placeholder="Organization (e.g., Softpro India)" value={expFormData.company} onChange={e => setExpFormData({...expFormData, company: e.target.value})} className={inputStyles} required />
                  <div className="flex gap-4">
                    <input type="text" placeholder="Duration (2022-2026)" value={expFormData.duration} onChange={e => setExpFormData({...expFormData, duration: e.target.value})} className={inputStyles} required />
                    <input type="text" placeholder="Location" value={expFormData.location} onChange={e => setExpFormData({...expFormData, location: e.target.value})} className={inputStyles} required />
                  </div>
                  <label className="flex items-center gap-3 text-gray-400 text-sm cursor-pointer ml-1">
                    <input type="checkbox" checked={expFormData.current} onChange={e => setExpFormData({...expFormData, current: e.target.checked})} className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500" />
                    Currently active here
                  </label>
                  <textarea placeholder="Description (Press enter for new point)" value={expFormData.description} onChange={e => setExpFormData({...expFormData, description: e.target.value})} className={`${inputStyles} h-28 resize-none`} required />
                  <button type="submit" className={`${btnPrimary} mt-2`}>Add to Timeline</button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className={cardStyles}>
                <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2"><span className="w-2 h-6 bg-purple-500 rounded-full"></span> Manage Timeline</h2>
                <div className="flex flex-col gap-3">
                  {experiences.map(exp => (
                    <div key={exp._id} className="border border-gray-700 bg-gray-900/50 p-4 rounded-xl flex justify-between items-center hover:border-indigo-500/50 transition-all">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full border border-gray-700 uppercase tracking-wider">{exp.category}</span>
                        <h3 className="font-bold text-gray-200 mt-1">{exp.role}</h3>
                        <p className="text-xs text-gray-500">{exp.company} • {exp.duration}</p>
                      </div>
                      <button onClick={() => handleDelete('experience', exp._id)} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-all">Delete</button>
                    </div>
                  ))}
                  {experiences.length === 0 && <p className="text-center text-gray-500 py-10">Timeline is empty.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== MESSAGES TAB ===================== */}
        {activeTab === 'messages' && (
          <div className={`${cardStyles} max-w-4xl mx-auto animate-fade-in`}>
            <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2"><span className="w-2 h-6 bg-pink-500 rounded-full"></span> Client Inquiries</h2>
            <div className="flex flex-col gap-5">
              {messages.map(msg => (
                <div key={msg._id} className={`p-5 rounded-xl border transition-all ${msg.replied ? 'border-gray-700 bg-gray-900/40 opacity-70' : 'border-blue-500/30 bg-blue-900/10 shadow-[0_0_15px_rgba(59,130,246,0.05)]'}`}>
                  <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-800 pb-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-200">{msg.name} <span className="text-sm font-normal text-blue-400 ml-2">&lt;{msg.email}&gt;</span></h3>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 mt-3 md:mt-0">
                      {msg.replied ? (
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1">✓ Replied</span>
                      ) : (
                        <button onClick={() => setReplyingTo(msg)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">Reply</button>
                      )}
                      <button onClick={() => handleDelete('messages', msg._id)} className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">Trash</button>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>
                  
                  {replyingTo?._id === msg._id && (
                    <form onSubmit={handleReply} className="mt-5 flex flex-col gap-3 bg-gray-950 p-4 rounded-xl border border-gray-800">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Replying to {msg.name}</label>
                      <textarea placeholder="Type your email response here..." value={replyText} onChange={e => setReplyText(e.target.value)} className={`${inputStyles} h-24 text-sm`} required />
                      <div className="flex gap-3 justify-end mt-1">
                        <button type="button" onClick={() => { setReplyingTo(null); setReplyText(''); }} className="text-gray-400 hover:text-white px-4 py-2 text-sm font-bold transition-colors">Cancel</button>
                        <button type="submit" className="bg-white text-gray-900 hover:bg-gray-200 px-5 py-2 rounded-lg text-sm font-bold transition-colors">Send Email</button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-16">
                  <span className="text-5xl opacity-50">📭</span>
                  <p className="text-gray-500 font-semibold mt-4">No new inquiries.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;