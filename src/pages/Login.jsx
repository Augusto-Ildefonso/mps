import { useState } from 'react'
import logo from '../assets/logo.jpeg'
import TextField from '../component/auth/TextField'
import PasswordField from '../component/auth/PasswordField'
import SocialLoginLink from '../component/auth/SocialLoginLink'
import SignInButton from '../component/auth/SignInButton'
import Link from '../component/auth/Link'
import { useNavigate } from 'react-router-dom'
const LoginPage = () => {
  const navigate = useNavigate()
  const handleNavigateToHome = () => {
    navigate('/')
  }
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
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

            <div>
              <SignInButton text="Entrar" onClick={handleNavigateToHome} />
            </div>

            <div className="flex justify-end">
              <Link text="Esqueci minha senha" href="#" className="text-left"/>
            </div>

            <div className='flex justify-end'>
                <p className="text-center text-xs text-slate-500">
                  Não tem uma conta?{' '}
                  <Link text="Crie uma nova" href="#" />
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
