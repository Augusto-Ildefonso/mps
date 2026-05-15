import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const SalesChart = ({ data }) => {
    return (
        <div className="bg-full-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-deep-blue mb-4">Vendas - Últimos 30 Dias</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#9fa4b8" />
                    <YAxis stroke="#9fa4b8" />
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                        }}
                        formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`}
                    />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#fe8707" 
                        dot={false}
                        strokeWidth={2}
                        name="Vendas"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default SalesChart
