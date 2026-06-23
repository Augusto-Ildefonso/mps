import { useState } from "react"
import TextField from "../../component/auth/TextField"
import DropDown from "../../component/Forms/Dropdown"
import Header from "../../component/Header/Header"
import Button from "../../component/GeneralButton/Button"
import { addAddress } from "../../services/api/users"
import { useNavigate } from "react-router-dom"

const AddressPage = ({ title }) => {
    const navigate = useNavigate()
    const Estados = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
        "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE",
        "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP",
        "SE", "TO"
    ]
    const [identificacao, setIdentificacao] = useState("")
    const [destinatario, setDestinatario] = useState("")
    const [cep, setCep] = useState("")
    const [rua, setRua] = useState("")
    const [numero, setNumero] = useState("")
    const [bairro, setBairro] = useState("")
    const [cidade, setCidade] = useState("")
    const [estado, setEstado] = useState("")
    const [complemento, setComplemento] = useState("")
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")

    const validate = () => {
        const next = {}
        if (!identificacao.trim()) next.identificacao = "A identificação é obrigatória."
        if (!cep.trim()) next.cep = "O CEP é obrigatório."
        if (!rua.trim()) next.rua = "A rua é obrigatória."
        if (!cidade.trim()) next.cidade = "A cidade é obrigatória."
        if (!estado.trim()) next.estado = "O estado é obrigatório."
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleCepChange = (e) => {
        const value = e.target.value
        const formattedValue = value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2')
        setCep(formattedValue)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setSubmitting(true)
        setSubmitError("")

        try {
            await addAddress({
                name: identificacao.trim(),
                cep: cep.replace(/\D/g, ""),
                street: rua.trim(),
                number: numero.trim(),
                neighborhood: bairro.trim(),
                city: cidade.trim(),
                state: estado,
                complement: complemento.trim(),
            })
            navigate("/account/addresses")
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Erro ao salvar endereço.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            <Header showBackButton={true} backTo="/account" />
            <h1 className="text-center font-bold text-deep-blue text-xl">{title}</h1>
            <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
                <TextField id="Identificação" name="Identificação" label="Identificação*" placeholder="Casa, Trabalho, etc." value={identificacao} onChange={(e) => setIdentificacao(e.target.value)} />
                {errors.identificacao && <p className="text-red text-sm">{errors.identificacao}</p>}
                <TextField id="Destinatário" name="Destinatário" label="Destinatário" placeholder="Nome do destinatário" value={destinatario} onChange={(e) => setDestinatario(e.target.value)} />
                <TextField id="Cep" name="Cep" label="CEP*" placeholder="12345-678" value={cep} onChange={handleCepChange} />
                {errors.cep && <p className="text-red text-sm">{errors.cep}</p>}
                <TextField id="Rua" name="Rua" label="Rua*" placeholder="Rua das Flores" value={rua} onChange={(e) => setRua(e.target.value)} />
                {errors.rua && <p className="text-red text-sm">{errors.rua}</p>}
                <TextField id="Número" name="Número" label="Número" placeholder="123" value={numero} onChange={(e) => setNumero(e.target.value)} />
                <TextField id="Bairro" name="Bairro" label="Bairro" placeholder="Centro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                <div className="flex gap-4">
                    <div className="flex-1">
                        <TextField id="Cidade" name="Cidade" label="Cidade*" placeholder="São Paulo" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                        {errors.cidade && <p className="text-red text-sm">{errors.cidade}</p>}
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="Estado" className="mb-1 block text-bg font-medium text-slate-700 ">Estado*</label>
                        <DropDown options={Estados.map((estado) => ({ value: estado, label: estado }))} value={estado} onChange={(e) => setEstado(e.target.value)} />
                        {errors.estado && <p className="text-red text-sm">{errors.estado}</p>}
                    </div>
                </div>
                <TextField id="Complemento" name="Complemento" label="Complemento" placeholder="Apartamento, casa, etc." value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                {submitError && <p className="text-red text-sm">{submitError}</p>}
                <Button type="submit" bg_color="bg-orange" text={submitting ? "Salvando..." : "Salvar"} disabled={submitting} />
            </form>
        </div>
    )
}

export default AddressPage
