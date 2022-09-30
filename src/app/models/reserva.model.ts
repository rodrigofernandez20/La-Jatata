import { Order } from "./order.model";

export class Reserva {
    _id?: number;
    date?: Date;
    zone?: string;
    clientName?: string;
    num_people?: number;
    total?: number;
    notas?: string;
    waiterId?: number;
    products?:Order[]/* =[{
        product_id: Number,
        product_name: String,
        price: Number,
        quantity:Number,
        total:Number
    }]*/;
}
