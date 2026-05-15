import TextField from "../../component/auth/TextField"

const Step3Company = ({ formData, handleChange, errors, documentType }) => {
    if (documentType === "cpf") {
        return (
            <div className="grid gap-4">
                <div className="rounded-2xl bg-light-gray p-4 text-sm text-gray">
                    Você escolheu CPF, então não há dados empresariais adicionais.
                </div>

                <div className="grid gap-3 rounded-2xl border border-gray/20 p-4 text-sm text-slate-700">
                    <p className="font-semibold text-deep-blue">Documento selecionado</p>
                    <p>Tipo: CPF</p>
                    <p>Número: {formData.documentNumber || "Ainda não informado"}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid gap-4">
            <div className="rounded-2xl bg-light-gray p-4 text-sm text-gray">
                Como você escolheu CNPJ, precisamos de alguns dados da empresa para deixar o cadastro pronto para integração.
            </div>

            <TextField
                id="companyName"
                name="companyName"
                label="Razão social*"
                placeholder="Digite a razão social"
                value={formData.companyName}
                onChange={handleChange}
            />
            {errors.companyName && <p className="text-sm text-red">{errors.companyName}</p>}

            <TextField
                id="fantasyName"
                name="fantasyName"
                label="Nome fantasia"
                placeholder="Digite o nome fantasia"
                value={formData.fantasyName}
                onChange={handleChange}
            />
            {errors.fantasyName && <p className="text-sm text-red">{errors.fantasyName}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <TextField
                        id="stateRegistration"
                        name="stateRegistration"
                        label="Inscrição estadual*"
                        placeholder="Digite a inscrição estadual"
                        value={formData.stateRegistration}
                        onChange={handleChange}
                    />
                    {errors.stateRegistration && <p className="text-sm text-red">{errors.stateRegistration}</p>}
                </div>

                <div>
                    <TextField
                        id="businessArea"
                        name="businessArea"
                        label="Área de atuação"
                        placeholder="Ex.: Varejo, Serviços, Indústria"
                        value={formData.businessArea}
                        onChange={handleChange}
                    />
                    {errors.businessArea && <p className="text-sm text-red">{errors.businessArea}</p>}
                </div>
            </div>
        </div>
    )
}

export default Step3Company
