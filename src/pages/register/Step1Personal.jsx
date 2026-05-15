import TextField from "../../component/auth/TextField"
import DropDown from "../../component/Forms/Dropdown"

const Step1Personal = ({ formData, handleChange, handleDocumentTypeChange, errors }) => {
    return (
        <div className="grid gap-4">
            <TextField
                id="fullName"
                name="fullName"
                label="Nome completo*"
                placeholder="Digite seu nome completo"
                value={formData.fullName}
                onChange={handleChange}
            />
            {errors.fullName && <p className="text-sm text-red">{errors.fullName}</p>}

            <TextField
                id="email"
                name="email"
                type="email"
                label="Email*"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={handleChange}
            />
            {errors.email && <p className="text-sm text-red">{errors.email}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
                

                <div>
                    <label htmlFor="documentType" className="mb-1 block text-bg font-medium text-slate-700">
                        Tipo de documento*
                    </label>
                    <DropDown
                        id="documentType"
                        name="documentType"
                        options={[
                            { value: "cpf", label: "CPF" },
                            { value: "cnpj", label: "CNPJ" },
                        ]}
                        value={formData.documentType}
                        onChange={handleDocumentTypeChange}
                    />
                    {errors.documentType && <p className="text-sm text-red">{errors.documentType}</p>}
                </div>
            

            <TextField
                id="documentNumber"
                name="documentNumber"
                label={formData.documentType === "cnpj" ? "CNPJ*" : "CPF*"}
                placeholder={formData.documentType === "cnpj" ? "00.000.000/0000-00" : "000.000.000-00"}
                value={formData.documentNumber}
                onChange={handleChange}
                inputMode="numeric"
            />
            {errors.documentNumber && <p className="text-sm text-red">{errors.documentNumber}</p>}
        </div>
        </div>
    )
}

export default Step1Personal
