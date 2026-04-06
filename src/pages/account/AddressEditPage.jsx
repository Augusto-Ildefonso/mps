import TextField from "../../component/Auth/TextField";
import DropDown from "../../component/Forms/Dropdown";
import Header from "../../component/Header/Header";
import { useState } from "react";
import NavBar from "../../component/NavBar/NavBar";
const AddressEditPage = () => {
    const Estados = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
        "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE",
        "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP",
        "SE", "TO"
    ];
    const [identificacao, setIdentificacao] = useState("");
    const [destinatario, setDestinatario] = useState("");
    const [cep, setCep] = useState("");
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [complemento, setComplemento] = useState("");
    const [identificacaoError, setIdentificacaoError] = useState(null);
    const [cepError, setCepError] = useState(null);
    const [ruaError, setRuaError] = useState(null);
    const [cidadeError, setCidadeError] = useState(null);
    const [estadoError, setEstadoError] = useState(null);
    const validateIdentificacao = (value) => {
        if (value.trim() === "") {
            return "A identificação é obrigatória.";
        }
        return "";
    };
    
    const validateCep = (value) => {
        const cepRegex = /^\d{5}-\d{3}$/;
        if (!cepRegex.test(value)) {
            return "O CEP deve estar no formato 12345-678.";
        }
        return "";
    };
    
    const validateRua = (value) => {
        if (value.trim() === "") {
            return "A rua é obrigatória.";
        }
        return "";
    };
    
    const validateCidade = (value) => {
        if (value.trim() === "") {
            return "A cidade é obrigatória.";
        }
        const cidadeRegex = /^[a-zA-Z\s]+$/;
        if (!cidadeRegex.test(value)) {
            return "A cidade deve conter apenas letras e espaços.";
        }
        return "";
    };
    
    const validateEstado = (value) => {
        if (value.trim() === "") {
            return "O estado é obrigatório.";
        }
        return "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const identificacaoError = validateIdentificacao(identificacao);
        const cepError = validateCep(cep);
        const ruaError = validateRua(rua);
        const cidadeError = validateCidade(cidade);
        const estadoError = validateEstado(estado);

        setIdentificacaoError(identificacaoError);
        setCepError(cepError);
        setRuaError(ruaError);
        setCidadeError(cidadeError);
        setEstadoError(estadoError);

        if (identificacaoError || cepError || ruaError || cidadeError || estadoError) {
            return;
        }
        alert("Endereço salvo com sucesso!");
    }

    const handleCepChange = (e) => {
        const value = e.target.value;
        const formattedValue = value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
        setCep(formattedValue);
    };

    return (
        <div>
            <Header />
            <h1 className="text-center font-bold text-deep-blue text-xl">Editar Endereço</h1>
            <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
                <TextField id="Identificação" name="Identificação" label="Identificação*" placeholder="Casa, Trabalho, etc." value={identificacao} onChange={(e) => setIdentificacao(e.target.value)}  />
                    {identificacaoError && <p className="text-red text-sm">{identificacaoError}</p>}
                <TextField id="Destinatário" name="Destinatário" label="Destinatário" placeholder="Nome do destinatário" value={destinatario} onChange={(e) => setDestinatario(e.target.value)} />
                <TextField id="Cep" name="Cep" label="CEP*" placeholder="12345-678" value={cep} onChange={handleCepChange} />
                    {cepError && <p className="text-red text-sm">{cepError}</p>}
                <TextField id="Rua" name="Rua" label="Rua*" placeholder="Rua das Flores" value={rua} onChange={(e) => setRua(e.target.value)} />
                    {ruaError && <p className="text-red text-sm">{ruaError}</p>}
                <TextField id="Número" name="Número" label="Número" placeholder="123" value={numero} onChange={(e) => setNumero(e.target.value)} />
                <div className="flex gap-4">
                    <div>
                <TextField id="Cidade" name="Cidade" label="Cidade*" placeholder="São Paulo" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                    {cidadeError && <p className="text-red text-sm">{cidadeError}</p>}
                </div>
                <div className="w-1/2">
                <label htmlFor="Estado" className="mb-1 block text-bg font-medium text-slate-700 ">
                    Estado*
                </label>
                <DropDown  options={Estados.map((estado) => ({ value: estado, label: estado }))} value={estado} onChange={(e) => setEstado(e.target.value)} />
                    {estadoError && <p className="text-red text-sm">{estadoError}</p>}
                </div>
                </div>
                <TextField id="Complemento" name="Complemento" label="Complemento" placeholder="Apartamento, casa, etc." value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                <button type="submit" className="bg-orange rounded-md h-16 text-xl text-bold">Salvar</button>
            </form>
            <NavBar />
        </div>
    )
}

export { AddressEditPage }