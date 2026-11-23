import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LayoutDashboard, CheckSquare, CalendarDays, BarChart3, Settings, Search, Bell, Plus, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2, Check, Clock3, CircleDot, Target, X, Menu, SlidersHorizontal, Sparkles, ArrowUpRight } from 'lucide-react';
import './styles.css';

const seedTasks = [
 {id:'t1',title:'Redesign the landing page',description:'Refresh the hero section and improve the conversion flow.',category:'Design',status:'In progress',priority:'High',dueDate:'2026-11-25'},
 {id:'t2',title:'Review Q4 campaign analytics',description:'Compile performance metrics and share key takeaways.',category:'Marketing',status:'To do',priority:'Medium',dueDate:'2026-11-26'},
 {id:'t3',title:'Update component library',description:'Document reusable buttons, inputs and card patterns.',category:'Development',status:'Completed',priority:'Low',dueDate:'2026-11-20'},
 {id:'t4',title:'Prepare sprint planning',description:'Prioritize the backlog and estimate upcoming stories.',category:'Planning',status:'In progress',priority:'Medium',dueDate:'2026-11-27'},
 {id:'t5',title:'Write onboarding email sequence',description:'Draft the first three welcome emails for new users.',category:'Content',status:'To do',priority:'High',dueDate:'2026-11-29'},
 {id:'t6',title:'Fix mobile navigation spacing',description:'Check menu behavior at tablet and mobile breakpoints.',category:'Development',status:'Completed',priority:'Low',dueDate:'2026-11-21'}
];
const notes = [
 {tag:'DAILY REMINDER',title:'Small steps make big progress.',body:'Focus on the next action, not the entire staircase. Consistency beats intensity.',tone:'lavender',icon:'✦'},
 {tag:'PRODUCTIVITY TIP',title:'Give your attention a home.',body:'Choose one priority for this block of time. Close the extra tabs and let yourself finish.',tone:'mint',icon:'◒'},
 {tag:'A MOMENT TO RESET',title:'Pause. Breathe. Begin again.',body:'A short reset can bring your best thinking back. Progress is allowed to be gradual.',tone:'peach',icon:'☼'}
];
const fmtDate = d => d ? new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}) : 'No date';
function App(){
 const [tasks,setTasks]=useState(()=>{try{const saved=localStorage.getItem('focusboard.tasks');return saved?JSON.parse(saved):seedTasks}catch{return seedTasks}});
 const [tab,setTab]=useState('All tasks'),[priority,setPriority]=useState('All priorities'),[query,setQuery]=useState('');
 const [slide,setSlide]=useState(0),[modal,setModal]=useState(false),[editing,setEditing]=useState(null),[menu,setMenu]=useState(null),[mobileNav,setMobileNav]=useState(false);
 useEffect(()=>localStorage.setItem('focusboard.tasks',JSON.stringify(tasks)),[tasks]);
 const stats=useMemo(()=>({total:tasks.length,progress:tasks.filter(t=>t.status==='In progress').length,done:tasks.filter(t=>t.status==='Completed').length}),[tasks]);
 const filtered=useMemo(()=>tasks.filter(t=>(tab==='All tasks'||t.status===tab)&& (priority==='All priorities'||t.priority===priority) && (t.title+' '+t.description+' '+t.category).toLowerCase().includes(query.toLowerCase())),[tasks,tab,priority,query]);
 const completion=stats.total?Math.round(stats.done/stats.total*100):0;
 function openCreate(){setEditing(null);setModal(true)}
 function saveTask(data){if(editing)setTasks(old=>old.map(t=>t.id===editing.id?{...data,id:editing.id}:t));else setTasks(old=>[{...data,id:crypto.randomUUID()},...old]);setModal(false);setEditing(null)}
 function editTask(t){setEditing(t);setModal(true);setMenu(null)}
 function deleteTask(t){if(window.confirm(`Delete "${t.title}"? This action cannot be undone.`)){setTasks(old=>old.filter(x=>x.id!==t.id));setMenu(null)}}
 function changeStatus(id,status){setTasks(old=>old.map(t=>t.id===id?{...t,status}:t))}
 const next=()=>setSlide(s=>(s+1)%notes.length),prev=()=>setSlide(s=>(s+notes.length-1)%notes.length);
 return <div className="app-shell">
  <aside className={`sidebar ${mobileNav?'show':''}`}>
   <div className="brand"><div className="brand-mark"><Target size={20}/></div><span>focus<span className="brand-light">board</span></span><button className="mobile-close icon-btn" onClick={()=>setMobileNav(false)} aria-label="Close menu"><X/></button></div>
   <div className="workspace-label">WORKSPACE</div>
   <nav aria-label="Main navigation">
    <button className="nav-item active"><LayoutDashboard size={18}/>Overview</button>
    <button className="nav-item" onClick={()=>{setTab('All tasks');setMobileNav(false)}}><CheckSquare size={18}/>My tasks <span className="nav-count">{tasks.length}</span></button>
    <button className="nav-item"><CalendarDays size={18}/>Calendar</button>
    <button className="nav-item"><BarChart3 size={18}/>Insights</button>
   </nav>
   <div className="sidebar-bottom"><div className="workspace-label">PREFERENCES</div><button className="nav-item"><Settings size={18}/>Settings</button><div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={17}/></div><strong>Make room for focus.</strong><p>One clear priority at a time.</p><button onClick={()=>setTab('All tasks')}>Explore workspace <ArrowUpRight size={14}/></button></div><div className="profile"><div className="avatar">LK</div><div><strong>Lokesh Kumar</strong><small>Personal workspace</small></div><MoreHorizontal size={18}/></div></div>
  </aside>
  {mobileNav&&<div className="scrim" onClick={()=>setMobileNav(false)} />}
  <main className="main-area">
   <header className="topbar"><div className="top-left"><button className="icon-btn mobile-menu" onClick={()=>setMobileNav(true)} aria-label="Open menu"><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <b>Overview</b></div></div><div className="top-actions"><div className="today"><CalendarDays size={15}/> Monday, November 23, 2026</div><button className="icon-btn notification" aria-label="Notifications"><Bell size={18}/><i/></button><div className="avatar small">LK</div></div></header>
   <div className="content">
    <section className="welcome-row"><div><div className="eyebrow">MONDAY, NOVEMBER 23, 2026</div><h1>Good afternoon, Lokesh <span>✦</span></h1><p>Here's what's happening with your work today.</p></div><button className="primary-btn" onClick={openCreate}><Plus size={17}/> New task</button></section>
    <section className="stats-grid" aria-label="Task overview">
     <Stat label="Total tasks" value={stats.total} icon={<CheckSquare/>} tint="violet" foot="Across your workspace"/>
     <Stat label="In progress" value={stats.progress} icon={<Clock3/>} tint="blue" foot="Currently underway"/>
     <Stat label="Completed" value={stats.done} icon={<Check/>} tint="green" foot="Nicely done!"/>
     <div className="stat-card completion-card"><div className="stat-top"><span>Completion rate</span><div className="stat-icon tint-orange"><Target/></div></div><div className="stat-value">{completion}<small>%</small></div><div className="progress-track"><span style={{width:completion+'%'}}/></div><div className="stat-foot">Of all your tasks</div></div>
    </section>
    <section className="focus-section"><div className="section-heading"><div><div className="eyebrow">A LITTLE INSPIRATION</div><h2>Focus notes</h2></div><div className="carousel-controls"><button className="icon-btn" onClick={prev} aria-label="Previous focus note"><ChevronLeft/></button><button className="icon-btn" onClick={next} aria-label="Next focus note"><ChevronRight/></button></div></div>
     <div className={`focus-note ${notes[slide].tone}`}><div className="note-symbol">{notes[slide].icon}</div><div className="note-copy"><span>{notes[slide].tag}</span><h3>{notes[slide].title}</h3><p>{notes[slide].body}</p></div><div className="note-pagination">{notes.map((n,i)=><button key={n.tag} className={i===slide?'selected':''} onClick={()=>setSlide(i)} aria-label={`Show focus note ${i+1}`}/>)}</div></div>
    </section>
    <section className="tasks-section">
     <div className="section-heading task-heading"><div><div className="eyebrow">STAY ON TOP OF IT</div><h2>Your tasks <span className="task-total">{filtered.length}</span></h2></div><button className="secondary-btn desktop-add" onClick={openCreate}><Plus size={16}/> Add task</button></div>
     <div className="task-toolbar"><div className="tabs" role="tablist" aria-label="Filter tasks by status">{['All tasks','To do','In progress','Completed'].map(t=><button key={t} role="tab" aria-selected={tab===t} className={tab===t?'chosen':''} onClick={()=>setTab(t)}>{t}</button>)}</div><div className="filters"><div className="search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tasks..." aria-label="Search tasks"/></div><div className="priority-select"><SlidersHorizontal size={15}/><select value={priority} onChange={e=>setPriority(e.target.value)} aria-label="Filter by priority"><option>All priorities</option><option>High</option><option>Medium</option><option>Low</option></select></div></div></div>
     <div className="task-list">
      {filtered.length===0?<div className="empty-state"><div className="empty-icon"><Search/></div><strong>No tasks found</strong><p>Try changing your search or filters.</p><button className="text-btn" onClick={()=>{setQuery('');setPriority('All priorities');setTab('All tasks')}}>Clear filters</button></div>:filtered.map(t=><article className="task-row" key={t.id}>
       <button className={`task-check ${t.status==='Completed'?'checked':''}`} onClick={()=>changeStatus(t.id,t.status==='Completed'?'To do':'Completed')} aria-label={t.status==='Completed'?'Mark as not completed':'Mark as completed'}>{t.status==='Completed'&&<Check size={13}/>}</button>
       <div className="task-main"><div className={`task-title ${t.status==='Completed'?'muted':''}`}>{t.title}</div><div className="task-description">{t.description}</div><div className="task-meta"><span className="category">{t.category}</span><span className="due"><CalendarDays size={13}/>{fmtDate(t.dueDate)}</span></div></div>
       <div className="task-status"><span className={`status-pill ${t.status.toLowerCase().replace(' ','-')}`}><i/>{t.status}</span></div><span className={`priority-pill ${t.priority.toLowerCase()}`}>{t.priority}</span>
       <div className="task-menu-wrap"><button className="icon-btn more-btn" aria-label={`Actions for ${t.title}`} onClick={()=>setMenu(menu===t.id?null:t.id)}><MoreHorizontal size={19}/></button>{menu===t.id&&<div className="action-menu"><button onClick={()=>editTask(t)}><Pencil size={14}/>Edit task</button><button className="danger" onClick={()=>deleteTask(t)}><Trash2 size={14}/>Delete task</button></div>}</div>
      </article>)}
     </div>
     <div className="list-footer"><span>Showing <b>{filtered.length}</b> of <b>{tasks.length}</b> tasks</span><span>Keep going, you're doing great <span className="footer-star">✦</span></span></div>
    </section>
    <footer>Made for a more focused you <span>✦</span></footer>
   </div>
  </main>
  {modal&&<TaskModal task={editing} onClose={()=>{setModal(false);setEditing(null)}} onSave={saveTask}/>}
 </div>
}
function Stat({label,value,icon,tint,foot}){return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className={`stat-icon tint-${tint}`}>{icon}</div></div><div className="stat-value">{value}</div><div className="stat-foot">{foot}</div></div>}
function TaskModal({task,onClose,onSave}){
 const [form,setForm]=useState(task||{title:'',description:'',category:'Personal',status:'To do',priority:'Medium',dueDate:''});const [error,setError]=useState('');
 function update(e){setForm(f=>({...f,[e.target.name]:e.target.value}))}
 function submit(e){e.preventDefault();if(!form.title.trim()){setError('Please enter a task title.');return}onSave({...form,title:form.title.trim()})}
 return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><div><div className="eyebrow">{task?'MAKE AN UPDATE':'MAKE IT HAPPEN'}</div><h2 id="modal-title">{task?'Edit task':'Create a task'}</h2><p>{task?'Update the details of your task.':'Add something meaningful to your to-do list.'}</p></div><button className="icon-btn" onClick={onClose} aria-label="Close dialog"><X/></button></div><form onSubmit={submit}><label>Task title <em>*</em><input name="title" value={form.title} onChange={e=>{update(e);setError('')}} placeholder="e.g. Prepare project presentation" autoFocus/>{error&&<small className="field-error">{error}</small>}</label><label>Description<textarea name="description" value={form.description} onChange={update} placeholder="Add a few details about this task..." rows="3"/></label><div className="form-grid"><label>Status<select name="status" value={form.status} onChange={update}><option>To do</option><option>In progress</option><option>Completed</option></select></label><label>Priority<select name="priority" value={form.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></label><label>Category<input name="category" value={form.category} onChange={update} placeholder="e.g. Design"/></label><label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={update}/></label></div><div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button type="submit" className="primary-btn">{task?'Save changes':<><Plus size={16}/> Create task</>}</button></div></form></section></div>
}
createRoot(document.getElementById('root')).render(<App/>);