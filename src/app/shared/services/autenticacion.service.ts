import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../../environments/environment';
import { Empleado } from '../models/empleado';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  
  private currentUserSubject: BehaviorSubject<Empleado>;
  public currentUser: Observable<Empleado>;
  private currentProfileSubject: BehaviorSubject<Empleado>;
  public currentProfile: Observable<Empleado>;
  
  private empleado: Empleado;
  private empleadoLogeado = new BehaviorSubject<Empleado>(null);
  empleadoLog$ = this.empleadoLogeado.asObservable()

  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<Empleado>(JSON.parse(localStorage.getItem('currentUserSession')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentProfileSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('perfilEmpleado')));
    this.currentProfile = this.currentProfileSubject.asObservable();
  }

  public get currentUserValue(): Empleado {
    return this.currentUserSubject.value;
  }

  public get currentProfileValue(): any {
    return this.currentProfileSubject.value;
  }

  getEmpleadoLogeado(idUser) {
    return this.http.get(`${environment.apiURL}/dashboard/getEmployeById/${idUser}`).subscribe(
      (empleado: Empleado) => this.empleadoLogeado.next(empleado), 
      (error) => console.log(error) 
    );
  }

  getUser(idUser) {
    return this.http.get(`${environment.apiURL}/dashboard/getEmployeById/${idUser}`);
  }

  loginUser(user) {
    const headerss = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiURL}/dashboard/autenticacion`, JSON.stringify(user), { headers: headerss })
      .pipe(map( user => {
        this.currentUserSubject.next(user.idEmpleado);
        this.currentProfileSubject.next(user.perfil);
        return user;
      }));
  }

  restoreUser(user) {
    const headerss = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiURL}/dashboard/restoreEmploye`, JSON.stringify(user), { headers: headerss })
  }

  updatePassword(user) {
    const headerss = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiURL}/dashboard/changePassword`, JSON.stringify(user), { headers: headerss })
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUserSession');
    localStorage.removeItem('perfilEmpleado');
    this.currentUserSubject.next(null);
    this.currentProfileSubject.next(null);
  }

  userAuthenticated(idPerfil: number, idOpcion: number) {
    return this.http.get(`${environment.apiURL}/config/isAuthenticated/${idPerfil}/${idOpcion}`);
  }

}

