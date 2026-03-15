import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../../services/student.service';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentService: { getAll: jest.Mock; delete: jest.Mock };

  beforeEach(async () => {
    studentService = {
      getAll: jest.fn().mockReturnValue(of([{ id: 1, firstName: 'Jean', lastName: 'Dupont' }])),
      delete: jest.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        { provide: StudentService, useValue: studentService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call StudentService.getAll and set students', () => {
    expect(studentService.getAll).toHaveBeenCalled();
    expect(component.students).toEqual([{ id: 1, firstName: 'Jean', lastName: 'Dupont' }]);
    expect(component.loading).toBe(false);
  });

  it('deleteStudent when confirm returns true should call delete and loadStudents', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteStudent(1);
    expect(studentService.delete).toHaveBeenCalledWith(1);
    expect(studentService.getAll).toHaveBeenCalledTimes(2); // once in ngOnInit, once in deleteStudent
    (window.confirm as jest.Mock).mockRestore();
  });

  it('deleteStudent when confirm returns false should not call delete', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    component.deleteStudent(1);
    expect(studentService.delete).not.toHaveBeenCalled();
    (window.confirm as jest.Mock).mockRestore();
  });
});

describe('StudentListComponent loadStudents error', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentService: { getAll: jest.Mock };

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    studentService = {
      getAll: jest.fn().mockReturnValue(throwError(() => new Error('Network error'))),
    };
    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        { provide: StudentService, useValue: studentService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('loadStudents on error should set loading to false', () => {
    expect(component.loading).toBe(false);
  });
});
