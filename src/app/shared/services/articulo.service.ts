import { Injectable } from '@angular/core';
import { ArticuloContent, Articulo, EstatusArticulo } from './../models/articulo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  dataArticulos: Articulo[] = [];

  constructor(
    private http: HttpClient
  ) {}

  getArticulos(paginator: number): Observable<ArticuloContent>  {
    return this.http.get<ArticuloContent>(`${environment.apiURL}/catalog/getAllArticle/${paginator}`); 
  }

  getArticulo(idArticulo: number): Observable<Articulo>  {
    return this.http.get<Articulo>(`${environment.apiURL}/catalog/getArticuloById/${idArticulo}`); 
  }

  getArticulosFiltro(texto: string, idFamilia: number, materiaPrima: number): Observable<Articulo[]>  {
    return this.http.get<Articulo[]>(`${environment.apiURL}/catalog/getArticleByFilter/${texto}/${idFamilia}/${materiaPrima}`); 
  }

  // getSelectEstatusArticulo
  getSelectEstatusArticulo(): Observable<EstatusArticulo[]>  {
    return this.http.get<EstatusArticulo[]>(`${environment.apiURL}/catalog/getSelectEstatusArticulo`); 
  }

  updateArticulo(articulo: Partial<Articulo>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/updateArticle`, JSON.stringify(articulo), { headers: headerss});
  }

  deleteImagenArticulo(img: any): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/deleteImageArticle`, JSON.stringify(img), { headers: headerss});
  }


}



