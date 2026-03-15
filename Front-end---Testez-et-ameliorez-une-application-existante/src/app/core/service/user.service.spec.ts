import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { UserService } from './user.service';
import { Login } from '../models/Login';
import { Register } from '../models/Register';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should POST to /api/login and return token', () => {
    const loginData: Login = { login: 'user', password: 'pass' };
    const token = 'jwt-token';
    service.login(loginData).subscribe((res) => {
      expect(res).toBe(token);
    });
    const req = httpMock.expectOne('http://localhost:8080/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginData);
    expect(req.request.responseType).toBe('text');
    req.flush(token);
  });

  it('register should POST to /api/register', () => {
    const registerData: Register = {
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: 'secret',
    };
    service.register(registerData).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerData);
    req.flush({});
  });
});
