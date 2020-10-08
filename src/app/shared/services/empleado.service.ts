import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Empleado, EmpleadoContent } from './../models/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor(
    private http: HttpClient
  ) { }

  getEmpleados(paginator: number): Observable<EmpleadoContent>  {
    return this.http.get<EmpleadoContent>(`catalog/getAllEmploye/${paginator}`); 
  }

  getEmpleado(idEmpleado) {
    return this.http.get<Empleado>(`dashboard/getEmployeById/${idEmpleado}`);
  }

  getEmpleadososFiltro(texto: string): Observable<Empleado[]>  {
    return this.http.get<Empleado[]>(`catalog/getEmployerByFilter/${texto}`); 
  }

  createEmpleado(empleado: Empleado): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`catalog/createEmploye`, JSON.stringify(empleado), { headers: headerss});
  }

  updateEmpleado(empleado: Partial<Empleado>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`catalog/updateEmploye   `, JSON.stringify(empleado), { headers: headerss});
  }

  deleteEmpleado(empleado: Partial <Empleado>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`catalog/deleteEmploye`, JSON.stringify(empleado), { headers: headerss});
  }

  getGafeteEmpleado(idEmpleado) {
    return this.http.get<any>(`catalog/getGafete/${idEmpleado}`);
  }

  uploadFotoEmpleado(data: any): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`catalog/uploadPhotoEmploye`, JSON.stringify(data), { headers: headerss});
  }


}
