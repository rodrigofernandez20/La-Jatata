import { Order } from "./order.model";

export interface Comanda {
    family?: string;
    waiter?: string;
    order?: Order[];
}

