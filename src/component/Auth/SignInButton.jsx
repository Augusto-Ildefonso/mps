const SignInButton = ({
  text = 'Sign in',
  type = 'button',
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="h-10 w-full rounded-md bg-orange text-black font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-orange-300"
    >
      {text}
    </button>
  )
}

export default SignInButton
