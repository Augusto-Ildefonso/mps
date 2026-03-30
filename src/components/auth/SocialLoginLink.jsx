import { FcGoogle } from 'react-icons/fc'

const SocialLoginLink = ({ href = '#', text = 'Login pelo Google', icon = <FcGoogle size={15} /> }) => {
  return (
    <a
      href={href}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-deep-blue bg-white text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
    >
      {icon}
      <span>{text}</span>
    </a>
  )
}

export default SocialLoginLink
