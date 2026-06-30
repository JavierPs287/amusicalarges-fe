import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FacebookContent } from '../model/facebookContent.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActualidadService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiBaseUrl}/actualidad`;

  getContenidos(): Observable<FacebookContent[]> {
    return this.http.get<unknown>(this.apiUrl+"/getFacebookContent").pipe(
      map((datos) => this.normalizarRespuesta(datos))
    );
  }

  private normalizarRespuesta(datos: unknown): FacebookContent[] {
    if (Array.isArray(datos)) {
      return datos as FacebookContent[];
    }
    if (datos && typeof datos === 'object') {
      const obj = datos as Record<string, unknown>;
      for (const key of ['data', 'content', 'items', 'resultados', 'resultado']) {
        const valor = obj[key];
        if (Array.isArray(valor)) {
          return valor as FacebookContent[];
        }
      }
    }
    console.warn('[ActualidadService] La respuesta del BE no tiene la forma esperada:', datos);
    return [];
  }

}
