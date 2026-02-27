import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent {

  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  studentId: number | null = null;

  form = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    phone: [''],
    address: [''],
    city: ['']
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.studentId = +id;
      this.studentService.getById(this.studentId).subscribe(student => {
        this.form.patchValue(student);
      });
    }
  }

  save() {
    if (this.studentId) {
      this.studentService.update(this.studentId, this.form.value)
        .subscribe(() => this.router.navigate(['/students']));
    } else {
      this.studentService.create(this.form.value)
        .subscribe(() => this.router.navigate(['/students']));
    }
  }
}
