import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.jpeg"
import Button from "../component/GeneralButton/Button"
import Link from "../component/auth/Link"
import Step1Personal from "./register/Step1Personal"
import Step2Address from "./register/Step2Address"
import Step3Company from "./register/Step3Company"
import Step4Credentials from "./register/Step4Credentials"
import { createUser } from "../services/api/users"
import { useAuth } from "../context/AuthContext"

const steps = [
    { key: 1, label: "Pessoais" },
    { key: 2, label: "Endereço" },
    { key: 3, label: "CPF/CNPJ" },
    { key: 4, label: "Senha" },
]

const initialFormData = {
    fullName: "",
    email: "",
    documentType: "cpf",
    documentNumber: "",
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
    companyName: "",
    fantasyName: "",
    stateRegistration: "",
    businessArea: "",
    password: "",
    confirmPassword: "",
    orderNotifications: true,
    marketingEmails: false,
    termsAccepted: false,
}

const RegisterPage = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState(initialFormData)
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [statusMessage, setStatusMessage] = useState("")
    const [registering, setRegistering] = useState(false)

    const progress = ((step - 1) / (steps.length - 1)) * 100

    function formatDocument(value, documentType) {
        const digits = value.replace(/\D/g, "")
        if (documentType === "cnpj") {
            return digits
                .replace(/^(\d{2})(\d)/, "$1.$2")
                .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/\.(\d{3})(\d)/, ".$1/$2")
                .replace(/(\d{4})(\d)/, "$1-$2")
                .slice(0, 18)
        }
        return digits
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2")
            .slice(0, 14)
    }

    const handleChange = (event) => {
        const { name, type, checked, value } = event.target
        const nextValue = type === "checkbox" ? checked : value

        setStatusMessage("")
        setFormData((previousData) => ({
            ...previousData,
            [name]: name === "documentNumber" ? formatDocument(nextValue, previousData.documentType) : nextValue,
        }))
    }

    const handleDocumentTypeChange = (event) => {
        const nextDocumentType = event.target.value

        setStatusMessage("")
        setFormData((previousData) => ({
            ...previousData,
            documentType: nextDocumentType,
            documentNumber: "",
            companyName: nextDocumentType === "cpf" ? "" : previousData.companyName,
            fantasyName: nextDocumentType === "cpf" ? "" : previousData.fantasyName,
            stateRegistration: nextDocumentType === "cpf" ? "" : previousData.stateRegistration,
            businessArea: nextDocumentType === "cpf" ? "" : previousData.businessArea,
        }))
        setErrors({})
    }

    const validateStep = (currentStep) => {
        const nextErrors = {}

        if (currentStep === 1) {
            if (!formData.fullName.trim()) nextErrors.fullName = "Informe seu nome completo."
            if (!formData.email.trim()) nextErrors.email = "Informe seu email."
            if (!formData.documentType) nextErrors.documentType = "Selecione CPF ou CNPJ."
            if (!formData.documentNumber.trim()) nextErrors.documentNumber = "Informe o número do documento."
        }

        if (currentStep === 2) {
            if (!formData.cep.trim()) nextErrors.cep = "Informe o CEP."
            if (!formData.street.trim()) nextErrors.street = "Informe a rua."
            if (!formData.number.trim()) nextErrors.number = "Informe o número."
            if (!formData.neighborhood.trim()) nextErrors.neighborhood = "Informe o bairro."
            if (!formData.city.trim()) nextErrors.city = "Informe a cidade."
            if (!formData.state.trim()) nextErrors.state = "Informe o estado."
        }

        if (currentStep === 3 && formData.documentType === "cnpj") {
            if (!formData.companyName.trim()) nextErrors.companyName = "Informe a razão social."
            if (!formData.stateRegistration.trim()) nextErrors.stateRegistration = "Informe a inscrição estadual."
        }

        if (currentStep === 4) {
            if (!formData.password.trim()) nextErrors.password = "Crie uma senha."
            if (!formData.confirmPassword.trim()) nextErrors.confirmPassword = "Confirme a senha."
            if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
                nextErrors.confirmPassword = "As senhas precisam ser iguais."
            }
            if (!formData.termsAccepted) nextErrors.termsAccepted = "Você precisa aceitar os termos para continuar."
        }

        return nextErrors
    }

    const handleNext = () => {
        const nextErrors = validateStep(step)

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors)
            return
        }

        setErrors({})
        setStep((previousStep) => Math.min(previousStep + 1, steps.length))
    }

    const handleBack = () => {
        setErrors({})
        setStatusMessage("")
        setStep((previousStep) => Math.max(previousStep - 1, 1))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const nextErrors = validateStep(step)
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors)
            return
        }

        setRegistering(true)
        setStatusMessage("")

        try {
            await createUser({
                cpf: formData.documentNumber.replace(/\D/g, ""),
                name: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password,
            })
            await login(formData.email.trim(), formData.password)
            navigate("/")
        } catch (err) {
            const message = err.response?.data?.message || "Erro ao criar conta. Tente novamente."
            setStatusMessage(message)
        } finally {
            setRegistering(false)
        }
    }

    const renderStepContent = () => {
        const sharedProps = {
            formData,
            handleChange,
            errors,
        }

        switch (step) {
            case 1:
                return <Step1Personal {...sharedProps} handleDocumentTypeChange={handleDocumentTypeChange} />
            case 2:
                return <Step2Address {...sharedProps} />
            case 3:
                return <Step3Company {...sharedProps} documentType={formData.documentType} />
            case 4:
                return (
                    <Step4Credentials
                        {...sharedProps}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        showConfirmPassword={showConfirmPassword}
                        setShowConfirmPassword={setShowConfirmPassword}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="flex min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center">
                <header className="mb-6 flex flex-col items-center gap-3">
                    <img src={logo} alt="MPS Logo" className="h-20 w-auto object-contain" />
                    <div className="text-center">
                        <h1 className="text-2xl font-extrabold text-deep-blue">Criar conta</h1>
                        <p className="mt-1 text-sm text-slate-500">Preencha os campos abaixo para criar sua conta</p>
                    </div>
                </header>

                <div className="w-full rounded-3xl bg-full-white p-5 shadow-sm sm:p-8">
                    <div className="mb-6">
                        <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-500">
                            <span>Etapa {step} de {steps.length}</span>
                            <span>{steps[step - 1].label}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-light-gray">
                            <div
                                className="h-full rounded-full bg-orange transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            {steps.map((item) => {
                                const isActive = item.key === step
                                const isDone = item.key < step

                                return (
                                    <div key={item.key} className="flex flex-col items-center gap-2">
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-colors ${
                                                isDone || isActive
                                                    ? "border-orange bg-orange text-full-white"
                                                    : "border-gray/30 bg-full-white text-slate-400"
                                            }`}
                                        >
                                            {item.key}
                                        </div>
                                        <span className={isActive ? "text-deep-blue" : ""}>{item.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        {renderStepContent()}

                        {statusMessage && <p className="rounded-2xl bg-green/10 px-4 py-3 text-sm font-medium text-green">{statusMessage}</p>}

                        <div className="flex flex-col gap-3 sm:flex-row">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="w-full rounded-xl border border-gray/20 bg-white px-4 py-4 mt-4 font-bold text-deep-blue transition active:scale-[0.98] sm:w-40"
                                >
                                    Voltar
                                </button>
                            )}

                            {step < steps.length ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full flex-1 rounded-xl bg-orange px-4 py-4 mt-4 font-bold text-full-white transition active:scale-[0.98]"
                                >
                                    Continuar
                                </button>
                            ) : (
                                <div className="w-full h-full flex-1">
                                    <Button type="submit" bg_color="bg-orange" text={registering ? "Criando..." : "Criar conta"} disabled={registering || !formData.termsAccepted} />
                                </div>
                            )}
                        </div>

                        <div className="text-center text-sm text-slate-500">
                            Já tem conta? <Link href="/login" text="Entrar" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
