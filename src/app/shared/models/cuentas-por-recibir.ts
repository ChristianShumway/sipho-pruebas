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
