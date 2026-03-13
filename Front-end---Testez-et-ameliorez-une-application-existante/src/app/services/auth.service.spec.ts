import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  // Configure le module de test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  // Supprime le mock HTTP
  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // Test si le service est créé
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test login()
  it('login() should call API and store token in localStorage', () => {
    const token = 'jwt-token-123';
    service.login('user', 'pass').subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ login: 'user', password: 'pass' });
    req.flush(token);

    expect(localStorage.getItem('auth_token')).toBe(token);
  });

  // Test getToken()
  it('getToken() returns stored token', () => {
    localStorage.setItem('auth_token', 'my-token');
    expect(service.getToken()).toBe('my-token');
  });

  // Test getToken() returns null when no token
  it('getToken() returns null when no token', () => {
    expect(service.getToken()).toBeNull();
  });

  // Test isLoggedIn() returns true when token exists
  it('isLoggedIn() returns true when token exists', () => {
    localStorage.setItem('auth_token', 'x');
    expect(service.isLoggedIn()).toBe(true);
  });

  // Test isLoggedIn() returns false when no token
  it('isLoggedIn() returns false when no token', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  // Test logout() removes token
  it('logout() removes token', () => {
    localStorage.setItem('auth_token', 'x');
    service.logout();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
