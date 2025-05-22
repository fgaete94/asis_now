import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstacionesServiceService {

  baseUrl = environment.API_OUC;

  constructor(private http: HttpClient) { }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Error ocurrido:', error);
    return throwError(() => error);
  }

  // Obtener información de la base URL
  getBaseUrlInfo(): Observable<any> {
    return this.http.get(this.baseUrl)
      .pipe(
        catchError(this.handleError)
      );
  }
}
