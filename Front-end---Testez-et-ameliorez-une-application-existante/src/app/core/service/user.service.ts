import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../models/Login';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient) {}

  login(data: Login): Observable<string> {
    return this.httpClient.post(`${this.apiUrl}/login`, data, {
      responseType: 'text'
    });
  }

  register(data: Register) {
    return this.httpClient.post(`${this.apiUrl}/register`, data);
  }
}
