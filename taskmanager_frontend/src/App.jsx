import { useState, useEffect, useCallback } from 'react'
import * as api from './api'
import './App.css'

const STATUS = {
  pending:     { label: 'Pending',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  dot: '○' },
  in_progress: { label: 'In Progress', color: '#6c8fff', bg: 'rgba(108,143,255,0.12)', dot: '◑' },
  completed:   { label: 'Completed',   color: '#10b981', bg: 'rgba(16,185,129,0.12)',  dot: '●' },
}
const NEXT = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' }

/* ── Auth Modal ── */
function AuthModal({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', password: '', email: '' })
  const [err,  setErr]  = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true)
    try {
      const res = await (mode === 'login' ? api.login(form) : api.register(form))
      onAuth(res.data.user)
    } catch (e) {
      const d = e.response?.data
      setErr(d?.error || (d && JSON.stringify(d)) || 'Something went wrong')
    } finally { setBusy(false) }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="overlay">
      <div className="auth-box">
        <div className="logo">✦ TaskFlow</div>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
        <p className="sub">{mode === 'login' ? 'Sign in to your workspace' : 'Start organising your work'}</p>
        {err && <div className="alert">{err}</div>}
        <form onSubmit={submit}>
          <Field label="Username"><input value={form.username} onChange={set('username')} placeholder="yourname" required autoFocus /></Field>
          {mode === 'register' && <Field label="Email"><input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" /></Field>}
          <Field label="Password"><input type="password" value={form.password} onChange={set('password')} placeholder="••••••" required minLength={6} /></Field>
          <button className="btn-primary full" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Register'}</button>
        </form>
        <p className="switch-text">
          {mode === 'login' ? "No account? " : "Have one? "}
          <button className="link-btn" onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setErr('') }}>
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
        <button className="ghost-link" onClick={() => onAuth(null)}>Continue as guest →</button>
      </div>
    </div>
  )
}

/* ── Task Modal ── */
function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(task ?? { title: '', description: '', status: 'pending' })
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault(); setBusy(true)
    try { await onSave(form); onClose() }
    catch { alert('Could not save task.') }
    finally { setBusy(false) }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{task ? 'Edit Task' : 'New Task'}</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <Field label="Title *">
            <input value={form.title} onChange={set('title')} placeholder="What needs to be done?" required autoFocus />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={set('description')} placeholder="Add details…" rows={3} />
          </Field>
          <Field label="Status">
            <div className="status-pills">
              {Object.entries(STATUS).map(([k, s]) => (
                <button type="button" key={k}
                  className={'pill' + (form.status === k ? ' pill-active' : '')}
                  style={form.status === k ? { background: s.bg, borderColor: s.color, color: s.color } : {}}
                  onClick={() => setForm(f => ({ ...f, status: k }))}>
                  {s.dot} {s.label}
                </button>
              ))}
            </div>
          </Field>
          <div className="modal-foot">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : task ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Task Card ── */
function TaskCard({ task, onEdit, onDelete, onStatus }) {
  const s = STATUS[task.status]
  const [deleting, setDeleting] = useState(false)

  const del = async () => {
    if (!confirm('Delete this task?')) return
    setDeleting(true); await onDelete(task.id)
  }

  return (
    <div className={'card' + (deleting ? ' fading' : '')}>
      <div className="card-top">
        <button className="status-tag" style={{ background: s.bg, color: s.color }}
          onClick={() => onStatus(task.id, NEXT[task.status])} title="Click to advance">
          {s.dot} {s.label}
        </button>
        <div className="card-actions">
          <button className="icon-btn edit" onClick={() => onEdit(task)} title="Edit">✎</button>
          <button className="icon-btn del"  onClick={del}             title="Delete">✕</button>
        </div>
      </div>
      <h4 className={'card-title' + (task.status === 'completed' ? ' struck' : '')}>{task.title}</h4>
      {task.description && <p className="card-desc">{task.description}</p>}
      <span className="card-date">{new Date(task.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
    </div>
  )
}

/* ── Shared Field ── */
function Field({ label, children }) {
  return <div className="field"><label>{label}</label>{children}</div>
}

/* ── App ── */
export default function App() {
  const [user,   setUser]   = useState(undefined)
  const [auth,   setAuth]   = useState(false)
  const [tasks,  setTasks]  = useState([])
  const [busy,   setBusy]   = useState(true)
  const [modal,  setModal]  = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [page,   setPage]   = useState(1)
  const [total,  setTotal]  = useState(1)

  useEffect(() => {
    api.getMe()
      .then(r => setUser(r.data.authenticated ? r.data.user : null))
      .catch(()  => setUser(null))
  }, [])

  const load = useCallback(async () => {
    setBusy(true)
    try {
      const params = { page }
      if (search) params.search = search
      if (filter) params.status = filter
      const r = await api.getTasks(params)
      const d = r.data
      setTasks(d.results ?? d)
      setTotal(d.count ? Math.ceil(d.count / 10) : 1)
    } catch { setTasks([]) }
    finally { setBusy(false) }
  }, [search, filter, page])

  useEffect(() => { if (user !== undefined) load() }, [user, load])

  const save = async (form) => {
    if (modal?.id) await api.updateTask(modal.id, form)
    else           await api.createTask(form)
    load()
  }

  const counts = {
    '': tasks.length,
    pending:     tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed:   tasks.filter(t => t.status === 'completed').length,
  }

  if (user === undefined) return <div className="splash"><span className="spin" />Loading…</div>
  if (auth) return <AuthModal onAuth={u => { setUser(u); setAuth(false) }} />

  return (
    <div className="layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">✦ TaskFlow</div>
        <nav>
          {[['', 'All Tasks'], ['pending', 'Pending'], ['in_progress', 'In Progress'], ['completed', 'Completed']].map(([v, l]) => (
            <button key={v} className={'nav-item' + (filter === v ? ' active' : '')}
              onClick={() => { setFilter(v); setPage(1) }}>
              <span>{l}</span>
              <span className="badge">{counts[v] ?? 0}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          {user
            ? <><div className="user-row"><div className="avatar">{user.username[0].toUpperCase()}</div><span>{user.username}</span></div>
                <button className="btn-ghost full sm" onClick={() => api.logout().then(() => setUser(null))}>Sign out</button></>
            : <button className="btn-primary full sm" onClick={() => setAuth(true)}>Sign in</button>}
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="main-head">
          <div>
            <h1>{filter ? STATUS[filter]?.label : 'All Tasks'}</h1>
            <p className="sub">{user ? `Hey, ${user.username}!` : 'Guest mode — sign in to save tasks'}</p>
          </div>
          <button className="btn-primary" onClick={() => setModal('new')}>+ New Task</button>
        </header>

        {/* Search */}
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search tasks…" />
          {search && <button className="clear-btn" onClick={() => setSearch('')}>✕</button>}
        </div>

        {/* Task list */}
        {busy
          ? <div className="splash inline"><span className="spin" />Loading…</div>
          : tasks.length === 0
            ? <div className="empty">
                <div className="empty-icon">◎</div>
                <h3>{search ? 'No results' : 'No tasks yet'}</h3>
                <p>{search ? 'Try a different term' : 'Create your first task'}</p>
                {!search && <button className="btn-primary" onClick={() => setModal('new')}>Create Task</button>}
              </div>
            : <>
                <div className="grid">
                  {tasks.map(t => (
                    <TaskCard key={t.id} task={t}
                      onEdit={t => setModal(t)}
                      onDelete={async id => { await api.deleteTask(id); load() }}
                      onStatus={async (id, s) => { await api.updateTask(id, { status: s }); load() }} />
                  ))}
                </div>
                {total > 1 && (
                  <div className="pages">
                    <button disabled={page === 1}     onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span>Page {page} of {total}</span>
                    <button disabled={page === total} onClick={() => setPage(p => p + 1)}>Next →</button>
                  </div>
                )}
              </>}
      </main>

      {modal && <TaskModal task={modal === 'new' ? null : modal} onSave={save} onClose={() => setModal(null)} />}
    </div>
  )
}
