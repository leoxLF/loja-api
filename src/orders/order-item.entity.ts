import { Order } from "./order.entity";

export class OrderItem{
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    order: Order;
}