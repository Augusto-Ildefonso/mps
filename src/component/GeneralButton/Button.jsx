const Button = ({ handleNavigation, bg_color, icon, text, ...props }) => {
    return (
        <button
            type="button"
            onClick={() => handleNavigation("logout")}
            className={`w-full flex flex-row items-center justify-center gap-2 p-4 ${bg_color} text-full-white rounded-xl font-bold active:scale-[0.98] transition duration-300 mt-4`}
            {...props}
        >
            {icon}
            <span>{text}</span>
        </button>
    )
}

export default Button;