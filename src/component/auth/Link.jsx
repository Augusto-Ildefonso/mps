import { Link as RouterLink } from "react-router-dom"

const Link = ({ text = "placeholder", href = "#", className = "" }) => {
  const baseClasses = "text-xs align-text-top font-medium text-blue underline-offset-4 transition hover:text-slate-900 hover:underline"

  if (href.startsWith("/")) {
    return (
      <RouterLink to={href} className={`${baseClasses} ${className}`}>
        {text}
      </RouterLink>
    )
  }

  return (
    <a href={href} className={`${baseClasses} ${className}`}>
      {text}
    </a>
  )
}

export default Link