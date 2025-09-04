import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormularioDataService {
  private apiUrl = 'http://localhost:3000/insertar-formulario'; // URL de tu backend

  constructor(private http: HttpClient) { }

  enviarFormulario(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
