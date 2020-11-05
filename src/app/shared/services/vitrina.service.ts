import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Vitrina, VitrinaContent } from './../models/vitrina';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VitrinaService {

  constructor(
    private http: HttpClient
  ) { }

  getVitrinas(paginator: number): Observable<VitrinaContent>  {
    return this.http.get<VitrinaContent>(`${environment.apiURL}/catalog/getAllVitrina/${paginator}`); 
  }

  getVitrina(idVitrina) {
    return this.http.get<Vitrina>(`${environment.apiURL}/catalog/getVitrinaById/${idVitrina}`);
  }
  
  getVitrinasFiltro(texto: string): Observable<Vitrina[]>  {
    return this.http.get<Vitrina[]>(`${environment.apiURL}/catalog/getVitrinaByFilter/${texto}`); 
  }

  updateVitrina(vitrina: Partial<Vitrina>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/updateVitrina`, JSON.stringify(vitrina), { headers: headerss});
  }

  deleteVitrina(vitrina: Partial <Vitrina>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/deleteVitrina`, JSON.stringify(vitrina), { headers: headerss});
  }

 
}
