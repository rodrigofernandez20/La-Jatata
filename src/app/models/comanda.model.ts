import { Time } from "@angular/common";
import { ComandaOrder } from "./comandaorder.model";

export class Comanda {
    _id?: Number;
    id_reserva?: Number;
    products?: ComandaOrder[];
    status?: String;
    createdAt?: Date;
    notes?:String;
    zone?: String;
    clientName?: String;
    waiterName?: String;
}

