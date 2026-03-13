import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../../services/student.service';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentService: { getAll: ReturnType<typeof jest.fn> };

  beforeEach(async () => {
    const getAllSpy = jest.fn().mockReturnValue(of([{ id: 1, firstName: 'Jean', lastName: 'Dupont' }]));
    studentService = { getAll: getAllSpy };

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
});
