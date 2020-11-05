export interface Vitrina {
  idVitrina?: number;
  descripcion: string;
  color: string;
  noCharolas: number;
  folio: string;
  idEmpleadoModifico: number;
}

export interface VitrinaContent {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: Vitrina[];
}
