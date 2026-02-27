import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../services/student.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './student-list.component.html',
})

export class StudentListComponent implements OnInit {

  private studentService = inject(StudentService);

  students: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement étudiants', err);
        this.loading = false;
      }
    });
  }

  deleteStudent(id: number): void {
    if (confirm('Supprimer cet étudiant ?')) {
      this.studentService.delete(id).subscribe(() => {
        this.loadStudents();
      });
    }
  }
}
