import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacebookContent } from '../model/facebookContent.model';

@Injectable({
  providedIn: 'root'
})
export class ActualidadService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/actualidad/getFacebookContent';

  getContenidos(): Observable<FacebookContent[]> {
    return this.http.get<FacebookContent[]>(this.apiUrl);
  }

}