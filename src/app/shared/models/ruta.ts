export interface Ruta {
  idRuta?: number;
  descripcion: string;
  idEmpleadoModifico: number;
}

export interface RutaContent {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: Ruta[];
}

