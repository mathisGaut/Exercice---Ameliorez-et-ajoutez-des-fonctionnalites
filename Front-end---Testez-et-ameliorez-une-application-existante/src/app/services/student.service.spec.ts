import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  // Configure le module de test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Supprime le mock HTTP
  afterEach(() => {
    httpMock.verify();
  });

  // Test si le service est créé
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test getAll()
  it('getAll() should call GET /api/students', () => {
    const mockStudents = [{ id: 1, firstName: 'Jean', lastName: 'Dupont' }];
    service.getAll().subscribe((data) => {
      expect(data).toEqual(mockStudents);
    });
    const req = httpMock.expectOne('http://localhost:8080/api/students');
    expect(req.request.method).toBe('GET');
    req.flush(mockStudents);
  });

  // Test getById()
  it('getById() should call GET /api/students/:id', () => {
    const mockStudent = { id: 1, firstName: 'Jean', lastName: 'Dupont' };
    service.getById(1).subscribe((data) => {
      expect(data).toEqual(mockStudent);
    });
    const req = httpMock.expectOne('http://localhost:8080/api/students/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockStudent);
  });

  // Test create()
  it('create() should call POST /api/students', () => {
    const student = { firstName: 'Jean', lastName: 'Dupont', email: 'j@t.fr', phone: '06', address: '1 rue', city: 'Paris' };
    service.create(student).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/students');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(student);
    req.flush({});
  });

  // Test update()
  it('update() should call PUT /api/students/:id', () => {
    const student = { firstName: 'Marie', lastName: 'Martin', email: 'm@t.fr', phone: '06', address: '1 rue', city: 'Paris' };
    service.update(1, student).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/students/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(student);
    req.flush({});
  });

  // Test delete()
  it('delete() should call DELETE /api/students/:id', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/students/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
