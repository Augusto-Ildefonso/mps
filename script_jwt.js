import jwt from 'jsonwebtoken'

const SECRET = 'please_work' // troque pelo JWT_SECRET do backend

const token = jwt.sign(
  { customer_id: '550e8400-e29b-41d4-a716-446655440000' },
  SECRET,
  { expiresIn: '7d', algorithm: 'HS256' }
)

console.log(token)
