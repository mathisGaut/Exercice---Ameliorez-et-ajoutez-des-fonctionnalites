import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../../services/student.service';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentService: { getById: jest.Mock; update: jest.Mock; create: jest.Mock };
  let router: { navigate: jest.Mock };

  beforeEach(async () => {
    studentService = {
      getById: jest.fn().mockReturnValue(of({ firstName: 'Jean', lastName: 'Dupont', email: 'j@d.fr', phone: '01', address: 'Rue', city: 'Paris' })),
      update: jest.fn().mockReturnValue(of({})),
      create: jest.fn().mockReturnValue(of({})),
    };
    router = { navigate: jest.fn() };
    await TestBed.configureTestingModule({
      imports: [StudentFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StudentService, useValue: studentService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit without id should not call getById', () => {
    component.ngOnInit();
    expect(studentService.getById).not.toHaveBeenCalled();
  });

  it('save without studentId should call create and navigate', () => {
    component.studentId = null;
    component.save();
    expect(studentService.create).toHaveBeenCalledWith(component.form.value);
    expect(studentService.update).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('save with studentId should call update and navigate', () => {
    component.studentId = 1;
    component.save();
    expect(studentService.update).toHaveBeenCalledWith(1, component.form.value);
    expect(studentService.create).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });
});

describe('StudentFormComponent with route id', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentService: { getById: jest.Mock; update: jest.Mock; create: jest.Mock };

  beforeEach(async () => {
    studentService = {
      getById: jest.fn().mockReturnValue(of({ firstName: 'Jean', lastName: 'Dupont', email: 'j@d.fr', phone: '01', address: 'Rue', city: 'Paris' })),
      update: jest.fn().mockReturnValue(of({})),
      create: jest.fn().mockReturnValue(of({})),
    };
    await TestBed.configureTestingModule({
      imports: [StudentFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StudentService, useValue: studentService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (k: string) => k === 'id' ? '1' : null } } } },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ngOnInit with id should call getById and patch form', () => {
    expect(studentService.getById).toHaveBeenCalledWith(1);
    expect(component.form.get('firstName')?.value).toBe('Jean');
  });
});
