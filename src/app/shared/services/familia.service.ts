import { Injectable } from '@angular/core';
import { Familia, FamiliaContent } from './../models/familia';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment'; 
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamiliaService {

  constructor(
    private http: HttpClient
  ) { }


  getFamilias(paginator: number): Observable<FamiliaContent>  {
    return this.http.get<FamiliaContent>(`${environment.apiURL}/catalog/getAllFamilia/${paginator}`); 
  }

  getFamilia(idFamilia: number): Observable<Familia>  {
    return this.http.get<Familia>(`${environment.apiURL}/catalog/getFamiliaById/${idFamilia}`); 
  }

  getFamiliasFiltro(texto: string): Observable<Familia[]>  {
    return this.http.get<Familia[]>(`${environment.apiURL}/catalog/getFamiliaByFilter/${texto}`); 
  }
  
  getSelectFamilia(): Observable<Familia[]>  {
    return this.http.get<Familia[]>(`${environment.apiURL}/catalog/getSelectFamilia`); 
  }

  updateFamilia(familia: Partial<Familia>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/updateFamilia`, JSON.stringify(familia), { headers: headerss});
  }

  deleteFamilia(familia: Partial <Familia>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/deleteFamilia`, JSON.stringify(familia), { headers: headerss});
  }
  
}
