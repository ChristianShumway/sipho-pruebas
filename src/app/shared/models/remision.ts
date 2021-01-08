import { Cliente } from "./cliente";
import { Empleado } from "./empleado";
import { Articulo } from "./articulo";

export interface Remision {
  idVenta: number;
  cliente: Cliente;
  idCliente: number;
  fechaCreacion: string;
  folioVenta: string;
  fechaTermino: string;
  idEmpleadoModifico: number;
  observaciones: string;
  transaccion: number;
  idCaja: number;
  idEstatus: number;
  idPedido: number;
  empleado: Empleado;
  viewDetVenta: ViewDetCuenta[];
  viewDetPago: ViewDetPago;
}

export interface ViewDetCuenta {
  idVenta: number;
  idDetVenta: number;
  articulo: Articulo;
  cantidad: number;
  precio: number;
  importe: number;
  descuento: number;
  prDescuento: number;
  total: number;
}

export interface ViewDetPago {
  idDetPago: number;
  idPago: number;
  idVenta: number;
  estatusCorte: number;
  monto: number;
  extras: string;
  idCorte: number;
  idCaja: number;
  descripcion: string;
}
