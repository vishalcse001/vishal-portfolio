import { useState, useEffect } from 'react';

function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('projects'); // Tabs: projects, experience, messages
  
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [messages, setMessages] = useState([]); // Naya state messages ke liye
  
  const [formData, setFormData] = useState({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' });
  const [expFormData, setExpFormData] = useState({ category: 'Experience', role: '', company: '', duration: '', location: '', current: false, description: '' });
  
  // Reply Modal ke states
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

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

      const projRes = await fetch('http://localhost:5000/api/projects');
      const projData = await projRes.json();
      if (Array.isArray(projData)) setProjects(projData);

      const expRes = await fetch('http://localhost:5000/api/experience');
      const expData = await expRes.json();
      if (Array.isArray(expData)) setExperiences(expData);

      // Messages sirf Admin mangwa sakta hai (token ke sath)
      if (token) {
        const msgRes = await fetch('http://localhost:5000/api/messages', { headers });
        const msgData = await msgRes.json();
        if (Array.isArray(msgData)) setMessages(msgData);
      }
    } catch (err) { console.error(err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
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

  // ... (Add Project aur Add Experience functions wahi same rahenge)
  const handleAddProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const formattedData = { ...formData, techStack: formData.techStack.split(',').map(tech => tech.trim()) };
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
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
      const response = await fetch('http://localhost:5000/api/experience', {
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
        const response = await fetch(`http://localhost:5000/api/${type}/${id}`, {
          method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) fetchData();
      } catch (err) { console.error(err); }
    }
  };

  // NAYA: Reply bhejne ka function
  const handleReply = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/messages/reply/${replyingTo._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ replyText })
      });
      if (response.ok) {
        alert("Reply Sent to User's Email Successfully!");
        setReplyingTo(null);
        setReplyText('');
        fetchData(); // Status update karne ke liye
      } else { alert("Failed to send reply"); }
    } catch (err) { console.error(err); }
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-3 overflow-x-auto w-full md:w-auto">
          <button onClick={() => setActiveTab('projects')} className={`px-5 py-2 rounded font-bold ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>Projects</button>
          <button onClick={() => setActiveTab('experience')} className={`px-5 py-2 rounded font-bold ${activeTab === 'experience' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>Timeline</button>
          
          {/* Naya Inbox Tab (Unread messages count bhi dikhayega) */}
          <button onClick={() => setActiveTab('messages')} className={`px-5 py-2 rounded font-bold flex items-center gap-2 ${activeTab === 'messages' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>
            Inbox 
            {messages.filter(m => !m.replied).length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{messages.filter(m => !m.replied).length}</span>
            )}
          </button>
          
          <button onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }} className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 ml-4">Logout</button>
        </div>
      </div>

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in">
           {/* ... (Projects form and list - I have kept it same as before, pasting directly) */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Add New Project</h2>
            <form onSubmit={handleAddProject} className="flex flex-col gap-3">
              <input type="text" placeholder="Project Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputStyles} required />
              <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputStyles} h-24`} required />
              <input type="text" placeholder="Tech Stack (comma separated)" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} className={inputStyles} required />
              <input type="text" placeholder="GitHub Link" value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} className={inputStyles} />
              <input type="text" placeholder="Live Demo Link" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} className={inputStyles} />
              <button type="submit" className="mt-2 bg-green-500 text-white font-bold py-3 rounded hover:bg-green-600">Add Project</button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Manage Projects</h2>
            <div className="flex flex-col gap-4">
              {projects.map(project => (
                <div key={project._id} className="border p-4 rounded-lg flex justify-between items-center bg-gray-50">
                  <div><h3 className="font-bold text-gray-900">{project.title}</h3></div>
                  <button onClick={() => handleDelete('projects', project._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'experience' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in">
          {/* ... (Timeline form and list - Same as before) */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Add Timeline Entry</h2>
            <form onSubmit={handleAddExperience} className="flex flex-col gap-3">
              <select value={expFormData.category} onChange={e => setExpFormData({...expFormData, category: e.target.value})} className={`${inputStyles} cursor-pointer font-bold`} required>
                <option value="Experience">💼 Work Experience</option><option value="Education">🎓 Education</option><option value="Certification">📜 Course / Certification</option>
              </select>
              <input type="text" placeholder="Role / Degree / Course Name" value={expFormData.role} onChange={e => setExpFormData({...expFormData, role: e.target.value})} className={inputStyles} required />
              <input type="text" placeholder="Company / College / Platform Name" value={expFormData.company} onChange={e => setExpFormData({...expFormData, company: e.target.value})} className={inputStyles} required />
              <div className="flex gap-4"><input type="text" placeholder="Duration (e.g., 2022 - 2026)" value={expFormData.duration} onChange={e => setExpFormData({...expFormData, duration: e.target.value})} className={`${inputStyles} w-1/2`} required /><input type="text" placeholder="Location" value={expFormData.location} onChange={e => setExpFormData({...expFormData, location: e.target.value})} className={`${inputStyles} w-1/2`} required /></div>
              <label className="flex items-center gap-2 text-gray-700 font-bold p-2 cursor-pointer"><input type="checkbox" checked={expFormData.current} onChange={e => setExpFormData({...expFormData, current: e.target.checked})} className="w-5 h-5" /> I am currently working/studying here</label>
              <textarea placeholder="Description (Write each point on a NEW LINE)" value={expFormData.description} onChange={e => setExpFormData({...expFormData, description: e.target.value})} className={`${inputStyles} h-32 resize-none`} required />
              <button type="submit" className="mt-2 bg-green-500 text-white font-bold py-3 rounded hover:bg-green-600">Add Entry</button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Manage Timeline</h2>
            <div className="flex flex-col gap-4">
              {experiences.map(exp => (
                <div key={exp._id} className="border p-4 rounded-lg flex justify-between items-center bg-gray-50">
                  <div><span className="text-xs font-bold px-2 py-1 bg-gray-200 text-gray-700 rounded mb-1 inline-block">{exp.category}</span><h3 className="font-bold text-gray-900">{exp.role}</h3><p className="text-sm text-gray-600">{exp.company}</p></div>
                  <button onClick={() => handleDelete('experience', exp._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== MESSAGES (INBOX) TAB ===================== */}
      {activeTab === 'messages' && (
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 animate-fade-in w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Inbox: Client Messages</h2>
          <div className="flex flex-col gap-6">
            {messages.map(msg => (
              <div key={msg._id} className={`border-2 p-5 rounded-xl flex flex-col gap-3 ${msg.replied ? 'border-gray-200 bg-gray-50' : 'border-blue-300 bg-blue-50'}`}>
                
                {/* Message Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-3 border-gray-200">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{msg.name} <span className="text-sm font-normal text-gray-600 ml-2">({msg.email})</span></h3>
                    <p className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 mt-3 md:mt-0">
                    {msg.replied ? (
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold border border-green-300">Replied ✓</span>
                    ) : (
                      <button onClick={() => setReplyingTo(msg)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-bold shadow-sm">Reply</button>
                    )}
                    <button onClick={() => handleDelete('messages', msg._id)} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 text-sm font-bold">Delete</button>
                  </div>
                </div>
                
                {/* Message Body */}
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                
                {/* Reply Form (Sirf tab dikhega jab Reply button par click ho) */}
                {replyingTo?._id === msg._id && (
                  <form onSubmit={handleReply} className="mt-4 flex flex-col gap-3 bg-white p-5 rounded-lg border border-blue-200 shadow-inner">
                    <label className="text-sm font-bold text-gray-700">Replying to {msg.email}:</label>
                    <textarea 
                      placeholder="Type your email reply here..." 
                      value={replyText} 
                      onChange={e => setReplyText(e.target.value)} 
                      className={`${inputStyles} h-32 resize-none`} 
                      required 
                    />
                    <div className="flex gap-3 justify-end mt-2">
                      <button type="button" onClick={() => { setReplyingTo(null); setReplyText(''); }} className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 font-bold">Cancel</button>
                      <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded font-bold hover:bg-green-600 shadow-md">Send Email & Mark as Replied</button>
                    </div>
                  </form>
                )}
              </div>
            ))}
            
            {messages.length === 0 && (
              <div className="text-center py-10">
                <span className="text-4xl">📭</span>
                <p className="text-gray-500 font-bold mt-4">Inbox is empty. No messages yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminPanel;