import { Time } from "@angular/common";
import { ComandaOrder } from "./comandaorder.model";

export class Comanda {
    _id?: Number;
    id_reserva?: Number;
    products?: ComandaOrder[];
    status?: String;
    created_at?: Time;
    notes?:String;
}

