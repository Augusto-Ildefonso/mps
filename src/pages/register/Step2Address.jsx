import TextField from "../../component/auth/TextField"
import DropDown from "../../component/Forms/Dropdown"

const states = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE",
    "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP",
    "SE", "TO"
]

const Step2Address = ({ formData, handleChange, errors }) => {
    return (
        <div className="grid gap-4">
            <TextField
                id="cep"
                name="cep"
                label="CEP*"
                placeholder="00000-000"
                value={formData.cep}
                onChange={handleChange}
                inputMode="numeric"
            />
            {errors.cep && <p className="text-sm text-red">{errors.cep}</p>}

            <TextField
                id="street"
                name="street"
                label="Rua*"
                placeholder="Digite sua rua"
                value={formData.street}
                onChange={handleChange}
            />
            {errors.street && <p className="text-sm text-red">{errors.street}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <TextField
                        id="number"
                        name="number"
                        label="Número*"
                        placeholder="Ex.: 123"
                        value={formData.number}
                        onChange={handleChange}
                    />
                    {errors.number && <p className="text-sm text-red">{errors.number}</p>}
                </div>

                <div>
                    <TextField
                        id="neighborhood"
                        name="neighborhood"
                        label="Bairro*"
                        placeholder="Digite seu bairro"
                        value={formData.neighborhood}
                        onChange={handleChange}
                    />
                    {errors.neighborhood && <p className="text-sm text-red">{errors.neighborhood}</p>}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <TextField
                        id="city"
                        name="city"
                        label="Cidade*"
                        placeholder="Digite sua cidade"
                        value={formData.city}
                        onChange={handleChange}
                    />
                    {errors.city && <p className="text-sm text-red">{errors.city}</p>}
                </div>

                <div>
                    <label htmlFor="state" className="mb-1 block text-bg font-medium text-slate-700">
                        Estado*
                    </label>
                    <DropDown
                        id="state"
                        name="state"
                        options={states.map((state) => ({ value: state, label: state }))}
                        value={formData.state}
                        onChange={handleChange}
                    />
                    {errors.state && <p className="text-sm text-red">{errors.state}</p>}
                </div>
            </div>

            <TextField
                id="complement"
                name="complement"
                label="Complemento"
                placeholder="Apartamento, bloco, referência..."
                value={formData.complement}
                onChange={handleChange}
            />
        </div>
    )
}

export default Step2Address
