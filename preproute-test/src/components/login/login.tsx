import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { setUser } from '../../utils/authStorage.ts'
// import { login } from '../../services/services'
import preprouteLogo from '../../assets/Preproute logo.png'
import './login.css'
import { login } from '../../services/services.ts'

export default function Login() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    const payload = {
      "userId": userId,
      "password": password
    }

    try {

      const response = await login(payload);
      if (response?.status === 200 || response?.data?.success) {
        setUser({ userId });
        navigate('/home');
      } else {
        console.error("Login failed");
      }

    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : 'Login failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <section className="login__panel login__panel--left">
        <h1 className="login__brand">PrepRoute</h1>
        <p className="login__tagline">Your path to exam success</p>
      </section>

      <section className="login__panel login__panel--right">
        <form className="login__card" onSubmit={handleSubmit}>
          <img
            src={preprouteLogo}
            alt="PrepRoute"
            className="login__logo"
          />
          <p className="login__subtitle">Login</p>
          <p className="login__description">Use your company provided Login Credentials</p>

          {error && <p className="login__error">{error}</p>}

          <label className="login__field">
            <span>UserId</span>
            <input
              type="text"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User Id"
              autoComplete="userId"
              required
              disabled={loading}
            />
          </label>

          <label className="login__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </label>

          <button
            type="button"
            className="login__forgot"
            disabled={loading}
          >
            Forgot Password?
          </button>

          <button type="submit" className="login__submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </section>
    </div>
  )
}
