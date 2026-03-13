import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../../services/auth.service';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  let authService: AuthService;
  let httpMock: HttpTestingController;

  // Configure le module de test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  // Supprime le mock HTTP
  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // Test should not add Authorization header for /api/login
  it('should not add Authorization header for /api/login', (done) => {
    TestBed.inject(HttpClient).get('http://localhost:8080/api/login').subscribe(() => done());
    const req = httpMock.expectOne('http://localhost:8080/api/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush('token');
  });

  // Test should not add Authorization header for /api/register
  it('should not add Authorization header for /api/register', (done) => {
    TestBed.inject(HttpClient).post('http://localhost:8080/api/register', {}).subscribe(() => done());
    const req = httpMock.expectOne('http://localhost:8080/api/register');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  // Test should add Bearer token when token exists
  it('should add Bearer token when token exists', (done) => {
    localStorage.setItem('auth_token', 'my-jwt-token');
    TestBed.inject(HttpClient).get('http://localhost:8080/api/students').subscribe(() => done());
    const req = httpMock.expectOne('http://localhost:8080/api/students');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-jwt-token');
    req.flush([]);
  });
});
