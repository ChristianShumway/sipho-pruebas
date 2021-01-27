export interface DetallesCuentaPorPagar {
  estatus: string;
  fechaPago: string;
  idCuentaPorCobrar: number;
  idDetCuentaPorCobrar: number;
  monto: number;
  pago: DatosPago[];
}

export interface DatosPago {
  credito: number;
  descripcion: string;
  idPago: number;
  imagen: string;
}
