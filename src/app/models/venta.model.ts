import { Order } from "./order.model";

export class Venta {
    _id?: number;
    date?: Date;
    clientName?: string;
    paymentMethod?: string;
    total?: number;
    products?:Order[];
}
