export interface CuentasPorRecibir {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: DataCuentasPorRecibir[];
}

export interface DataCuentasPorRecibir {
  nombre: string;
  saldo: number;
  pendientes: number;
}


export interface CuentaPorSaldar {
  idCuentaPorCobrar: number;
  idCliente: number;
  idVenta: number;
  descripcion: string;
  fechaCreacion: string;
  plazo: number;
  vencimiento: string;
  monto: number;
  saldo: number;
  fechaUltimoPago: string;
  selected?: boolean;
  expanded?: boolean;
}

export interface DatosPagoCuentas {
  idCliente: number;
  idEmpleado: number;
  idPago: number;
  abono: number;
  cuentas: CuentaPorSaldar[];
}
