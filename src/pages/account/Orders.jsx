import OrderBlock from "../../component/Orders/OrderBlock";
import motor from "../../assets/motor.jpg"
import { useNavigate } from "react-router-dom";



const Orders = () => {
    const navigate  = useNavigate();
    const mockOrder = {
        "orderId": "123456",
        "orderDate": "2024-06-01",
        "totalAmount": 99.99, /* Eu admito que vamos pegar o valor total da base de dados*/
        "status": "Cancelado",
        "toWhere": "Endereço",
        "product": [
            {id: 1, name:"Motor V8", image:motor, quantity: 1, price:2000.00},
            {id: 2, name:"Motor V6", image:motor, quantity: 1, price:1000.00}
        ]
    }
    return ( 
    <div className="Pedidos">
      <h1>Pedidos</h1>
      <OrderBlock OrderInfo={mockOrder} />
    </div>
  );
}

export default Orders;