import { useState } from 'react'
import logo from '../assets/logo.jpeg'
import TextField from '../component/auth/TextField'
import PasswordField from '../component/auth/PasswordField'
import SocialLoginLink from '../component/auth/SocialLoginLink'
import SignInButton from '../component/auth/SignInButton'
import Link from '../component/auth/Link'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Preencha todos os campos.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login(formData.email, formData.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center">
        <header className="mb-1 flex justify-center">
          <img src={logo} alt="MPS Logo" className="h-24 w-auto object-contain" />
        </header>

        <form className="w-full rounded-3xl p-6 sm:p-8">
          <div className="space-y-2">
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
            />

            <PasswordField
              id="password"
              name="password"
              label="Senha"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword((previous) => !previous)}
            />

            {error && <p className="text-sm text-red">{error}</p>}

            <div>
              <SignInButton text={loading ? 'Entrando...' : 'Entrar'} onClick={handleLogin} disabled={loading} />
            </div>

            <div className="flex justify-end">
              <Link text="Esqueci minha senha" href="#" className="text-left"/>
            </div>

            <div className='flex justify-end'>
                <p className="text-center text-xs text-slate-500">
                  Não tem uma conta?{' '}
                  <Link text="Crie uma nova" href="/register" />
                </p>
            </div>

            <div className="flex items-center px-1">
              <span className="h-px flex-1 bg-deep-blue" />
              <span className="px-3 text-sm font-medium text-slate-500">ou</span>
              <span className="h-px flex-1 bg-deep-blue" />
            </div>
            <SocialLoginLink text="Login pelo Google"/>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
