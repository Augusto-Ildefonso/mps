const Link = ({text = "placeholder", href = "#"}) => {
  return (
    <a href={href} className="text-xs align-text-top font-medium text-blue underline-offset-4 transition hover:text-slate-900 hover:underline">
      {text}
    </a>
  )
}

export default Link