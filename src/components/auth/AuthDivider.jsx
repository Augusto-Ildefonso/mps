const AuthDivider = ({ text = 'ou' }) => {
  return (
    <div className="flex items-center px-1">
      <span className="h-px flex-1 bg-deep-blue" />
      <span className="px-3 text-sm font-medium text-slate-500">{text}</span>
      <span className="h-px flex-1 bg-deep-blue" />
    </div>
  )
}

export default AuthDivider
