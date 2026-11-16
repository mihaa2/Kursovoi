import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'taskflow-tasks'
const makeId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      return Array.isArray(stored) ? stored : []
    } catch {
      return []
    }
  })
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingTask, setEditingTask] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error('Не вдалося зберегти завдання', error)
    }
  }, [tasks])

  useEffect(() => {
    if (editingTask === null) return
    const onEscape = (event) => {
      if (event.key === 'Escape') closeEdit()
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [editingTask])

  function addTask(event) {
    event.preventDefault()
    const title = text.trim()
    if (!title) return
    setTasks(previous => [{
      id: makeId(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    }, ...previous])
    setText('')
  }

  function toggleTask(id) {
    setTasks(previous => previous.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  function deleteTask(id) {
    setTasks(previous => previous.filter(task => task.id !== id))
    if (editingTask === id) closeEdit()
  }

  function editTask(id) {
    const task = tasks.find(item => item.id === id)
    if (!task) return
    setEditingTask(id)
    setEditText(task.title)
  }

  function closeEdit() {
    setEditingTask(null)
    setEditText('')
  }

  function saveEdit(event) {
    event.preventDefault()
    const title = editText.trim()
    if (!title) return
    setTasks(previous => previous.map(task =>
      task.id === editingTask ? { ...task, title } : task
    ))
    closeEdit()
  }

  const completed = tasks.filter(task => task.completed).length
  const remaining = tasks.length - completed
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0
  const visibleTasks = tasks.filter(task =>
    filter === 'active' ? !task.completed :
    filter === 'completed' ? task.completed : true
  )

  return (
    <div className="app">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="shell">
        <header className="header">
          <div className="brand">
            <div className="logo" aria-hidden="true">✓</div>
            <div>
              <h1>Task<span>Flow</span></h1>
              <p>Твій розумний планувальник</p>
            </div>
          </div>
          <div className="header-chip"><span className="live-dot" /> PREMIUM DARK</div>
        </header>

        <main>
          <section className="welcome">
            <span className="eyebrow"><span className="sparkle">✦</span> МІЙ ПРОСТІР ПРОДУКТИВНОСТІ</span>
            <h2>Твій день. <span>Твої правила.</span></h2>
            <p>Перетворюй плани на результати. Один крок — одна виконана задача.</p>
            <div className="hero-foot"><span>✧ Фокус на головному</span><span>✧ Прогрес щодня</span></div>
          </section>

          <section className="stats" aria-label="Статистика завдань">
            <div className="stat"><span className="stat-icon purple">▦</span><span>Усього завдань</span><strong>{tasks.length}</strong></div>
            <div className="stat"><span className="stat-icon green">✓</span><span>Виконано</span><strong>{completed}</strong></div>
            <div className="stat"><span className="stat-icon orange">◷</span><span>Залишилось</span><strong>{remaining}</strong></div>
          </section>

          <section className="progress-panel">
            <div className="progress-top"><div><span className="section-kicker">ТВІЙ ПРОГРЕС</span><h3>Рухайся до мети 🚀</h3></div><strong>{progress}%</strong></div>
            <div className="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress} aria-label="Виконано завдань">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p>{tasks.length === 0 ? 'Додай перше завдання, щоб розпочати.' : progress === 100 ? 'Усі завдання виконано! Чудова робота ✨' : `Виконано ${completed} із ${tasks.length}. Продовжуй у тому ж дусі!`}</p>
          </section>

          <section className="panel add-panel">
            <div className="panel-title"><span className="panel-title-icon">＋</span><div><h3>Нове завдання</h3><p>Запиши те, що важливо зробити</p></div></div>
            <form onSubmit={addTask} className="task-form">
              <input value={text} onChange={event => setText(event.target.value)} placeholder="Що плануєш сьогодні?" maxLength={120} aria-label="Назва нового завдання" />
              <button type="submit" disabled={!text.trim()}>＋ Додати</button>
            </form>
          </section>

          <section className="panel tasks-panel">
            <div className="section-heading"><div><span className="section-kicker">ОРГАНІЗАЦІЯ</span><h3>Мої завдання</h3></div><span className="count-pill">{visibleTasks.length} завдань</span></div>
            <div className="filters" aria-label="Фільтр завдань">
              {[
                ['all', 'Усі'],
                ['active', 'Активні'],
                ['completed', 'Виконані']
              ].map(([value, label]) => (
                <button key={value} type="button" className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)} aria-pressed={filter === value}>{label}</button>
              ))}
            </div>
            {visibleTasks.length === 0 ? (
              <div className="empty"><div className="empty-icon">☷</div><h4>Тут поки порожньо</h4><p>{tasks.length === 0 ? 'Створи своє перше завдання — і почни рух до мети.' : 'Для цього фільтра завдань поки немає.'}</p></div>
            ) : (
              <ul className="task-list">
                {visibleTasks.map(task => (
                  <li key={task.id} className={`task ${task.completed ? 'is-completed' : ''}`}>
                    <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} aria-label={`Позначити завдання «${task.title}» як ${task.completed ? 'невиконане' : 'виконане'}`} />
                    <span className={`task-title ${task.completed ? 'done' : ''}`}>{task.title}</span>
                    <div className="task-actions"><button type="button" onClick={() => editTask(task.id)} aria-label={`Редагувати: ${task.title}`} title="Редагувати">✎</button><button type="button" className="delete-btn" onClick={() => deleteTask(task.id)} aria-label={`Видалити: ${task.title}`} title="Видалити">×</button></div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
        <footer><span>✦ TaskFlow © 2026</span><span>Створено з React · PWA</span></footer>
      </div>

      {editingTask !== null && (
        <div className="modal-overlay" onMouseDown={event => { if (event.target === event.currentTarget) closeEdit() }}>
          <div className="edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-title">
            <div className="edit-modal-icon">✎</div>
            <h3 id="edit-title">Редагувати завдання</h3>
            <p>Онови назву завдання</p>
            <form onSubmit={saveEdit}>
              <input autoFocus value={editText} onChange={event => setEditText(event.target.value)} maxLength={120} aria-label="Нова назва завдання" />
              <div className="modal-buttons"><button type="button" className="cancel-btn" onClick={closeEdit}>Скасувати</button><button type="submit" className="save-btn" disabled={!editText.trim()}>Зберегти</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
