import type { Order } from "../types"

export let orders: Order[] = [
  { id: 1, userId: 1, status: "Створено", deliveryCountry: "Німеччина", createdAt: "2024-01-20", items:[{title:"Навушники", price:50, quantity:1}] }
]

export function addOrder(order: Order) {
  orders.push(order)
}
