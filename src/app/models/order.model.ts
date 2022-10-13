export interface Order {
  product_id?: number;
  product_name?: string;
  price?: number;
  quantity?: number;
  total?: number;
  sentQuantity?:number;
  receivedQuantity?:number;
  pendant?:number;
}
