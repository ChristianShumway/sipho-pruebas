import { Cliente } from "./cliente";
import { Articulo } from './articulo';

export interface Pedido {
  idPedido?: number;
  vistaCliente: Cliente;
  fechaSurtir: string;
  idEstatus: number;
  idEmpleadoModifico: number;
  detpedido?: DetallesPedido[];
}

export interface DetallesPedido {
  idDetPedido?: number;
  idPedido: number;
  articulo: Articulo;
  cantidad: number;
  idEmpleadoModifico: number;
  cantidadVespertino: number;
}

export interface PedidoContent {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: Pedido[];
  totalPedido: any[];
}
