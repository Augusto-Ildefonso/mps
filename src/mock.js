import motor from "./assets/motor.jpg"

export const mockReq = [
    {
        "id": 1,
        "name": "Motor",
        "price": 2000.0,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 2,
        "name": "Motor",
        "price": 5000.0,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 3,
        "name": "Motor",
        "price": 100.0,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 4,
        "name": "Motor",
        "price": 404.0,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 5,
        "name": "Motor",
        "price": 599.99,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 6,
        "name": "Motor",
        "price": 10.0,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 7,
        "name": "Motor",
        "price": 599.99,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 8,
        "name": "Motor",
        "price": 10.0,
        "url": motor,
        "alt": "motor"
    },
]
export const mockOrders = [
    {
            "orderId": "123456",
            "orderDate": "2024-06-01",
            "totalAmount": 99.99, /* Eu admito que vamos pegar o valor total da base de dados*/
            "status": "Cancelado",
            "toWhere": "Endereço",
            "product": [
                {id: 1, name:"Motor V8", image:motor, quantity: 1, price:2000.00},
                {id: 2, name:"Motor V6", image:motor, quantity: 1, price:1000.00}
            ]
        },
        {
            "orderId": "654321",
            "orderDate": "2024-05-15",
            "totalAmount": 150.00,
            "status": "Em andamento",
            "toWhere": "Endereço",
            "product": [
                {id: 3, name:"Motor V4", image:motor, quantity: 1, price:150.00}
            ]
        },
        {
            "orderId": "1010",
            "orderDate": "2024-05-15",
            "totalAmount": 150.00,
            "status": "Aguardando pagamento",
            "toWhere": "Endereço",
            "product": [
                {id: 3, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 4, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 5, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 6, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 7, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 8, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 9, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 10, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 11, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 12, name:"Motor V4", image:motor, quantity: 1, price:150.00},
            ]
        },
        {
            "orderId": "11121",
            "orderDate": "2024-05-15",
            "totalAmount": 150.00,
            "status": "Entregue",
            "toWhere": "Endereço",
            "product": [
                {id: 4, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 5, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 6, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 7, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 8, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 9, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 10, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 11, name:"Motor V4", image:motor, quantity: 1, price:150.00},
                {id: 12, name:"Motor V4", image:motor, quantity: 1, price:150.00},
            ]
        }

]

export const mockAddress = [
    {
        "id": 1,
        "name": "Casa",
        "street": "Rua das Flores",
        "number": "123",
        "city": "São Paulo",
        "state": "SP",
        "cep": "12345-678"
    },
    {
        "id": 2,
        "name": "Trabalho",
        "street": "Avenida Paulista",
        "number": "456",
        "city": "São Paulo",
        "state": "SP",
        "cep": "87654-321"
    }
]