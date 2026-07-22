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
   */
  addMatricula(matricula: Matricula): Observable<Matricula> {
    return this.http.post<Matricula>(`${this.apiUrl}/matricular`, matricula);
  }
}
