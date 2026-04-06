import OrderBlock from "../../component/Orders/OrderBlock";
import { useNavigate } from "react-router-dom";
import { mockOrders } from "../../mock";
import Header from "../../component/Header/Header";
import NavBar from "../../component/NavBar/NavBar";

const Orders = ({orders}) => {
    const navigate  = useNavigate();
    
    return ( 
    <div className="Pedidos">
      <Header />
      <h1 className="text-xl font-bold text-center text-deep-blue">Meus Pedidos</h1>
        <div className="flex flex-col gap-4">
            {mockOrders.map((order) => (
                <OrderBlock key={order.orderId} OrderInfo={order}/>
            ))}
        </div>
        <NavBar />
    </div>
  );
}

export default Orders;