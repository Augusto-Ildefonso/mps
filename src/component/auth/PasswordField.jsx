import { LuEye, LuEyeOff } from 'react-icons/lu'
import TextField from './TextField'

const PasswordField = ({ id, name, label, placeholder, value, onChange, showPassword, onToggleVisibility }) => {
  return (
    <div className="w-full">

      <div className="relative">
          <TextField
            id={id}
            name={name}
            type={showPassword ? 'text' : 'password'}
            label={label}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />

        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute right-4 top-1/2 flex w-8  items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {showPassword ? <LuEyeOff size={32} /> : <LuEye size={32} />}
        </button>
      </div>
    </div>
  )
}

export default PasswordField
