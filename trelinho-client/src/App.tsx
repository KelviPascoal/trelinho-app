import { useEffect, useState } from 'react'
import './App.css'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { fetchMe, type AuthUser } from './services/auth-api'

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [token, setToken] = useState<string | null>(localStorage.getItem('trelinho_token'))
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loadingMe, setLoadingMe] = useState(Boolean(token))
  const [meError, setMeError] = useState<string | null>(null)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)

    window.addEventListener('popstate', onPopState)

    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoadingMe(false)
      return
    }

    setLoadingMe(true)
    setMeError(null)

    fetchMe(token)
      .then(setUser)
      .catch((error: Error) => {
        localStorage.removeItem('trelinho_token')
        setToken(null)
        setMeError(error.message)
      })
      .finally(() => setLoadingMe(false))
  }, [token])

  const navigateTo = (nextPath: '/login' | '/register') => {
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath)
      setPath(nextPath)
    }
  }

  const onAuthenticated = (accessToken: string, authenticatedUser: AuthUser) => {
    localStorage.setItem('trelinho_token', accessToken)
    setToken(accessToken)
    setUser(authenticatedUser)
    setMeError(null)
  }

  const onLogout = () => {
    localStorage.removeItem('trelinho_token')
    setToken(null)
    setUser(null)
    navigateTo('/login')
  }

  if (loadingMe) {
    return <main className="auth-shell">Carregando sessão...</main>
  }

  if (user) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <h1>Trelinho</h1>
          <p>Você está autenticado.</p>
          <div className="session-data">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <button onClick={onLogout}>Sair</button>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-shell">
      {path === '/register' ? (
        <RegisterPage
          onNavigateLogin={() => navigateTo('/login')}
          onAuthenticated={onAuthenticated}
        />
      ) : (
        <LoginPage
          onNavigateRegister={() => navigateTo('/register')}
          onAuthenticated={onAuthenticated}
        />
      )}
      {meError && <p className="error-text">{meError}</p>}
    </main>
  )
}

export default App
