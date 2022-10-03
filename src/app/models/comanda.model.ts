import { Time } from "@angular/common";
import { Order } from "./order.model";

export class Comanda {
    _id?: Number;
    id_reserva?: Number;
    products?: Order[];
    status?: String;
    created_at?: Time;
}

