import { Grupo } from './grupo';

export interface Familia {
  idFamilia?: number;
  descripcion: string;
  idEmpleadoCreo?: number;
  idEmpleadoModifico?: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
  vistaGrupo: Grupo;
  cantidadMinima: number;
}


export interface FamiliaContent {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: Familia[];
}
