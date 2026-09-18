import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Lock, Unlock, Copy, Check } from 'lucide-react';

function AdminPanel() {
  // --- STATE VARIABLES ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('adminToken')));
  const [activeTab, setActiveTab] = useState('projects'); 
  
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [notes, setNotes] = useState([]); 
  
  const [formData, setFormData] = useState({ title: '', description: '', techStack: '', githubLink: '', liveLink: '' });
  const [imageFile, setImageFile] = useState(null);
  const [expFormData, setExpFormData] = useState({ category: 'Experience', role: '', company: '', duration: '', location: '', current: false, description: '' });
  
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const [noteForm, setNoteForm] = useState({ title: '', content: '', isSecret: false }); 
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [revealedNotes, setRevealedNotes] = useState({});
  const [copiedNoteId, setCopiedNoteId] = useState(null);

  const API_URL = 'https://vishal-portfolio-j3gb.onrender.com';

  // --- FETCH DATA & USE EFFECT ---
  const fetchData = useCallback(async () => {
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

        const notesRes = await fetch(`${API_URL}/api/notes`, { headers });
        const notesData = await notesRes.json();
        if (Array.isArray(notesData)) setNotes(notesData);
      }
    } catch (err) { console.error(err); }
  }, [API_URL]);

  useEffect(() => {
    if (isLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [isLoggedIn, fetchData]);

  // --- HANDLERS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
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
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('techStack', formData.techStack);
    submitData.append('githubLink', formData.githubLink);
    submitData.append('liveLink', formData.liveLink);
    if (imageFile) submitData.append('image', imageFile);

    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: submitData
      });
      if (response.ok) { 
        alert("Project Added with Image!"); 
        setFormData({ title: '', description: '', techStack: '', githubLink: '', liveLink: '' }); 
        setImageFile(null);
        document.getElementById('fileInput').value = "";
        fetchData(); 
      }
    } catch (err) { console.error(err); }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const formattedData = { ...expFormData, description: expFormData.description.split('\n').filter(d => d.trim() !== '') };
    try {
      const response = await fetch(`${API_URL}/api/experience`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(formattedData)
      });
      if (response.ok) { 
        alert(`${expFormData.category} Added!`); 
        setExpFormData({ category: 'Experience', role: '', company: '', duration: '', location: '', current: false, description: '' }); 
        fetchData(); 
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const url = editingNoteId ? `${API_URL}/api/notes/${editingNoteId}` : `${API_URL}/api/notes`;
      const method = editingNoteId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(noteForm)
      });

      if (response.ok) {
        alert(editingNoteId ? "Note Updated!" : "Note Saved!");
        setNoteForm({ title: '', content: '', isSecret: false });
        setEditingNoteId(null);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note._id);
    setNoteForm({ title: note.title, content: note.content, isSecret: Boolean(note.isSecret) });
    window.scrollTo(0,0);
  };

  const toggleRevealNote = (id) => {
    setRevealedNotes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyNoteContent = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedNoteId(id);
    setTimeout(() => {
      setCopiedNoteId(null);
    }, 2000);
  };

  const handleToggleNoteSecret = async (note) => {
    const token = localStorage.getItem('adminToken');
    try {
      const updatedSecret = !note.isSecret;
      const response = await fetch(`${API_URL}/api/notes/${note._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          isSecret: updatedSecret
        })
      });
      if (response.ok) {
        if (updatedSecret) {
          setRevealedNotes(prev => ({ ...prev, [note._id]: false }));
        }
        fetchData();
      }
    } catch (err) {
      console.error(err);
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
        alert("Reply Sent Successfully!");
        setReplyingTo(null);
        setReplyText('');
        fetchData(); 
      } else { alert("Failed to send reply"); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (type, id) => {
    const token = localStorage.getItem('adminToken');
    if(window.confirm(`Are you sure you want to delete this?`)) {
      try {
        const response = await fetch(`${API_URL}/api/${type}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (response.ok) fetchData();
      } catch (err) { console.error(err); }
    }
  };

  // --- STYLES ---
  const inputStyles = "w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500 transition-all";
  const cardStyles = "bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700";
  const btnPrimary = "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all";

  // --- LOGIN UI ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a] px-4 font-sans relative overflow-hidden">
        <div className="bg-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-800 w-full max-w-md z-10">
          <div className="text-center mb-8"><h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Admin Portal</h2></div>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyles} required />
            <button type="submit" className={btnPrimary}>Secure Login</button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-gray-100 font-sans pb-10">
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Workspace</h1>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <button onClick={() => setActiveTab('projects')} className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'projects' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>🚀 Projects</button>
            <button onClick={() => setActiveTab('experience')} className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'experience' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>🎓 Timeline</button>
            <button onClick={() => setActiveTab('notes')} className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'notes' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>📝 Notes</button>
            <button onClick={() => setActiveTab('messages')} className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${activeTab === 'messages' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>📬 Inbox</button>
            <button onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 px-5 py-2 rounded-lg text-sm font-semibold transition-all ml-2">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        
        {/* PROJECTS TAB */}
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
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider ml-1">Upload Image</label>
                    <input type="file" id="fileInput" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 cursor-pointer bg-gray-900 border border-gray-700 rounded-xl" required />
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
                    <div key={project._id} className="border border-gray-700 bg-gray-900/50 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-200">{project.title}</h3>
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

        {/* TIMELINE TAB */}
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

        {/* INBOX TAB */}
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
                <div className="text-center py-16"><span className="text-5xl opacity-50">📭</span><p className="text-gray-500 font-semibold mt-4">No new inquiries.</p></div>
              )}
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-5 space-y-6">
              <div className={cardStyles}>
                <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2"><span className="w-2 h-6 bg-yellow-500 rounded-full"></span> {editingNoteId ? 'Edit Note' : 'Create Quick Note'}</h2>
                <form onSubmit={handleSaveNote} className="flex flex-col gap-4">
                  <input type="text" placeholder="Note Title (e.g., WiFi Password, Server Key)" value={noteForm.title} onChange={e => setNoteForm({...noteForm, title: e.target.value})} className={inputStyles} required />
                  <textarea placeholder="Write your note, password, or sensitive details here..." value={noteForm.content} onChange={e => setNoteForm({...noteForm, content: e.target.value})} className={`${inputStyles} h-40 resize-none`} required />
                  
                  {/* Secret / Password Toggle */}
                  <label className="flex items-center gap-3 text-gray-300 text-sm cursor-pointer p-3 bg-gray-900 border border-gray-700 rounded-xl hover:border-yellow-500/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(noteForm.isSecret)}
                      onChange={e => setNoteForm({ ...noteForm, isSecret: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-yellow-500 focus:ring-yellow-500 accent-yellow-500 cursor-pointer"
                    />
                    <div className="flex items-center gap-2 select-none">
                      <Lock className="w-4 h-4 text-yellow-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-200 block">Hide Content (Password / Secret)</span>
                        <span className="text-xs text-gray-500 block">Content will remain hidden by default until you click Show</span>
                      </div>
                    </div>
                  </label>

                  <div className="flex gap-2">
                    <button type="submit" className={`${btnPrimary} flex-1`}>{editingNoteId ? 'Update Note' : 'Save Note'}</button>
                    {editingNoteId && (
                      <button type="button" onClick={() => { setEditingNoteId(null); setNoteForm({ title: '', content: '', isSecret: false }); }} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-bold transition-all">Cancel</button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className={cardStyles}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2"><span className="w-2 h-6 bg-orange-500 rounded-full"></span> Saved Notes & Passwords</h2>
                  <span className="text-xs text-gray-400 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">{notes.length} Total</span>
                </div>
                <div className="flex flex-col gap-4">
                  {notes.map(note => {
                    const isHiddenNote = Boolean(note.isSecret);
                    const isRevealed = Boolean(revealedNotes[note._id]);

                    return (
                      <div key={note._id} className={`border rounded-xl p-5 flex flex-col gap-3 transition-all ${
                        isHiddenNote ? 'border-yellow-500/30 bg-gray-900/70 shadow-[0_0_15px_rgba(234,179,8,0.05)]' : 'border-gray-700 bg-gray-900/50'
                      }`}>
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-lg text-yellow-400">{note.title}</h3>
                              {isHiddenNote && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                                  <Lock className="w-3 h-3" /> Password / Secret
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-500 shrink-0">{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>

                          {/* Content Section */}
                          <div className="mt-3">
                            {isHiddenNote ? (
                              <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800">
                                <div className="flex items-center justify-between gap-2 border-b border-gray-800 pb-2 mb-2">
                                  <span className="text-xs text-gray-400 flex items-center gap-1.5">
                                    {isRevealed ? (
                                      <><Unlock className="w-3.5 h-3.5 text-green-400" /> <span className="text-green-400 font-medium">Visible</span></>
                                    ) : (
                                      <><Lock className="w-3.5 h-3.5 text-yellow-400" /> <span className="text-yellow-400 font-medium">Hidden by default</span></>
                                    )}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => toggleRevealNote(note._id)}
                                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors"
                                      title={isRevealed ? "Hide Password" : "Show Password"}
                                    >
                                      {isRevealed ? (
                                        <>
                                          <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                                          <span>Hide</span>
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="w-3.5 h-3.5 text-yellow-400" />
                                          <span>Show</span>
                                        </>
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyNoteContent(note._id, note.content)}
                                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors"
                                      title="Copy content"
                                    >
                                      {copiedNoteId === note._id ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-green-400" />
                                          <span className="text-green-400">Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5 text-gray-400" />
                                          <span>Copy</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {isRevealed ? (
                                  <p className="text-gray-100 text-sm whitespace-pre-wrap font-mono select-all bg-gray-900 p-2.5 rounded-lg border border-gray-800 break-all">
                                    {note.content}
                                  </p>
                                ) : (
                                  <div className="py-2 px-2 flex items-center justify-between">
                                    <span className="font-mono text-base tracking-[0.25em] text-gray-500 select-none">
                                      ••••••••••••••••
                                    </span>
                                    <span className="text-xs text-gray-500 italic">Click "Show" to view</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-300 text-sm whitespace-pre-wrap">{note.content}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-800 pt-3 mt-1">
                          <button
                            type="button"
                            onClick={() => handleToggleNoteSecret(note)}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                              isHiddenNote
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20'
                                : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-gray-200 hover:bg-gray-700'
                            }`}
                            title={isHiddenNote ? "Remove hidden password status" : "Mark note as hidden password"}
                          >
                            {isHiddenNote ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            <span>{isHiddenNote ? 'Make Public' : 'Hide / Make Secret'}</span>
                          </button>

                          <div className="flex gap-2">
                            <button onClick={() => handleEditNote(note)} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all">Edit</button>
                            <button onClick={() => handleDelete('notes', note._id)} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all">Delete</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {notes.length === 0 && <p className="text-center text-gray-500 py-10">No notes saved yet.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminPanel;