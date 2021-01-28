import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { Cortes, CorteData } from './../models/cortes';
import { DetallesCorte } from './../models/detalles-corte';

@Injectable({
  providedIn: 'root'
})
export class CortesService {

  constructor(
    private http: HttpClient
  ) { }


  getCortesPorPeriodo(fechaInicio: string, fechaFin: string, pagina: number,): Observable<CorteData>  {
    return this.http.get<CorteData>(`${environment.apiURL}sale/cuts/getCutsByPeriod/${fechaInicio}/${fechaFin}/${pagina}`)
    .pipe(
      retry(3)
    ); 
  }

  getDetallesCorte(idCorte: number, idCaja: number,): Observable<DetallesCorte>  {
    return this.http.get<DetallesCorte>(`${environment.apiURL}sale/cuts/getDetCuts/${idCorte}/${idCaja}`)
    .pipe(
      retry(3)
    ); 
  }

}
