export interface DevolucionPedido {
  idBitacoraEntrega?: number;
  idRuta: number;
  cantidadDevuelta: number;
  cantidadVendida: number;
  fechaSurtir: string;
  idEmpleadoModificacion: number;
  indiceDevolucion: number;
  cantidadPedida: number;
}
