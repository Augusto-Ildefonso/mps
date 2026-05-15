import { useState } from "react"
import Header from "../../component/Header/Header"
import BannerNav from "../../component/NavBar/BannerNav"
import NavBar from "../../component/NavBar/NavBar"
import PasswordField from "../../component/auth/PasswordField"
import Button from "../../component/GeneralButton/Button"

const ChangePasswordPage = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [showPasswords, setShowPasswords] = useState(false)
    const [message, setMessage] = useState("")

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setMessage("Preencha a senha atual, a nova senha e a confirmação.")
            return
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage("A nova senha e a confirmação precisam ser iguais.")
            return
        }

        const payload = {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
        }

        console.log("Password change payload:", payload)
        setMessage("Formulário pronto para enviar ao backend.")
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header showBackButton={true} />
            <BannerNav />

            <main className="flex-1 px-2 md:px-4 pb-20">
                <div className="max-w-2xl mx-auto mt-4">
                    <div className="bg-full-white rounded-xl p-4 md:p-6 shadow-sm">
                        <div className="mb-6">
                            <h1 className="text-xl font-extrabold text-deep-blue text-center md:text-left">Alterar senha</h1>
                            <p className="text-sm text-gray mt-1 text-center md:text-left">Mantenha sua conta segura com uma senha forte e atualizada regularmente.</p>
                        </div>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <PasswordField
                                id="currentPassword"
                                name="currentPassword"
                                label="Senha atual"
                                placeholder="Digite sua senha atual"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                showPassword={showPasswords}
                                onToggleVisibility={() => setShowPasswords((previousState) => !previousState)}
                            />
                            <PasswordField
                                id="newPassword"
                                name="newPassword"
                                label="Nova senha"
                                placeholder="Digite a nova senha"
                                value={formData.newPassword}
                                onChange={handleChange}
                                showPassword={showPasswords}
                                onToggleVisibility={() => setShowPasswords((previousState) => !previousState)}
                            />
                            <PasswordField
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirmar nova senha"
                                placeholder="Repita a nova senha"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                showPassword={showPasswords}
                                onToggleVisibility={() => setShowPasswords((previousState) => !previousState)}
                            />

                            {/* <div className="rounded-lg bg-light-gray px-4 py-3 text-sm text-gray">
                                Payload esperado: currentPassword, newPassword.
                            </div> */}

                            {message && <p className="text-sm text-deep-blue font-medium">{message}</p>}

                            <Button type="submit" bg_color="bg-orange" text="Salvar nova senha" />
                        </form>
                    </div>
                </div>
            </main>

            <NavBar />
        </div>
    )
}

export default ChangePasswordPage