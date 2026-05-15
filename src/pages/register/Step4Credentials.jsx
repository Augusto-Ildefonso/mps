import PasswordField from "../../component/auth/PasswordField"

const Step4Credentials = ({ formData, handleChange, errors, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }) => {
    return (
        <div className="grid gap-4">
            <PasswordField
                id="password"
                name="password"
                label="Senha*"
                placeholder="Crie uma senha"
                value={formData.password}
                onChange={handleChange}
                showPassword={showPassword}
                onToggleVisibility={() => setShowPassword((previousState) => !previousState)}
            />
            {errors.password && <p className="text-sm text-red">{errors.password}</p>}

            <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar senha*"
                placeholder="Repita a senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                showPassword={showConfirmPassword}
                onToggleVisibility={() => setShowConfirmPassword((previousState) => !previousState)}
            />
            {errors.confirmPassword && <p className="text-sm text-red">{errors.confirmPassword}</p>}

            <div className="grid gap-3 rounded-2xl bg-light-gray p-4 text-sm text-slate-700">
                <label className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        name="orderNotifications"
                        checked={formData.orderNotifications}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-gray text-deep-blue focus:ring-deep-blue"
                    />
                    <span>Receber emails sobre pedidos e atualizações da conta.</span>
                </label>
                <label className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        name="marketingEmails"
                        checked={formData.marketingEmails}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-gray text-deep-blue focus:ring-deep-blue"
                    />
                    <span>Receber promoções, novidades e ofertas por email.</span>
                </label>
                <label className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-gray text-deep-blue focus:ring-deep-blue"
                    />
                    <span>Aceito os termos de uso e autorizo o cadastro com essas informações.*</span>
                </label>
                {errors.termsAccepted && <p className="text-sm text-red">{errors.termsAccepted}</p>}
            </div>
        </div>
    )
}

export default Step4Credentials
