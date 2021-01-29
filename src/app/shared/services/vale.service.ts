import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { ValeData } from './../models/vale';

@Injectable({
  providedIn: 'root'
})
export class ValeService {

  constructor(
    private http: HttpClient
  ) { }

  getValesCajaPorPeriodo(fechaInicio: string, fechaFin: string, pagina: number,): Observable<ValeData>  {
    return this.http.get<ValeData>(`${environment.apiURL}/sale/tpv/getValeCajabyPeriod/${fechaInicio}/${fechaFin}/${pagina}`)
    .pipe(
      retry(3)
    ); 
  }
}
