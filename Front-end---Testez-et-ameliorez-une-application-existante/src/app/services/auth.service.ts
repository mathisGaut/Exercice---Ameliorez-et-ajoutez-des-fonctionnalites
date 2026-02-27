import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  login(login: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { login, password }, { responseType: 'text' })
      .pipe(
        tap(token => {
          localStorage.setItem('auth_token', token);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  
}
