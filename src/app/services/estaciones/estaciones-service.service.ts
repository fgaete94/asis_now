import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstacionesServiceService {

  // Cambia la baseUrl a tu API Flask
  baseUrl = 'http://localhost:5000/api/estaciones';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Error ocurrido:', error);
    return throwError(() => error);
  }

  // Ahora obtiene las estaciones filtradas desde Flask
  getBaseUrlInfo(): Observable<any> {
    return this.http.get(this.baseUrl)
      .pipe(
        catchError(this.handleError)
      );
  }
}
