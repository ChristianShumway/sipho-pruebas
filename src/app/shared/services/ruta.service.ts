import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Ruta, RutaContent } from './../models/ruta';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RutaService {

  constructor(
    private http: HttpClient
  ) { }

  getRutas(paginator: number): Observable<RutaContent>  {
    return this.http.get<RutaContent>(`${environment.apiURL}/catalog/getAllRuta/${paginator}`); 
  }

  getRuta(idRuta) {
    return this.http.get<Ruta>(`${environment.apiURL}/catalog/getRutaById/${idRuta}`);
  }

  getRutasFiltro(texto: string): Observable<Ruta[]>  {
    return this.http.get<Ruta[]>(`${environment.apiURL}/catalog/getRutaByFilter/${texto}`); 
  }

  getSelectRuta(): Observable<Ruta[]>  {
    return this.http.get<Ruta[]>(`${environment.apiURL}/catalog/getSelectRuta`); 
  }

  updateRuta(ruta: Partial<Ruta>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/updateRuta`, JSON.stringify(ruta), { headers: headerss});
  }

  deleteRuta(ruta: Partial <Ruta>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/deleteRuta`, JSON.stringify(ruta), { headers: headerss});
  }
  
}
