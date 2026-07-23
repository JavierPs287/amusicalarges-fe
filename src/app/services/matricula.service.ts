import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Matricula } from '../model/matricula.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiBaseUrl}/matricula`;

  /**
   * Envía los datos de la matrícula al backend para que se persistan en la BD.
   * El backend solo responde con un 200 OK sin body.
   */
  addMatricula(matricula: Matricula): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/matricular`, matricula);
  }
}