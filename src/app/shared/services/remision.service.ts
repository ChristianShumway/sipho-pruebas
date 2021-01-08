import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Remision } from '../models/remision';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemisionService {

  constructor(
    private http: HttpClient
  ) { }

  getRemision(transaccion: number, idCaja: number): Observable<Remision>  {
    return this.http.get<Remision>(`${environment.apiURL}/sale/getVentaByTransaccionAndIdCaja/${transaccion}/${idCaja}`)
    .pipe(
      retry(3)
    ); 
  }

}
