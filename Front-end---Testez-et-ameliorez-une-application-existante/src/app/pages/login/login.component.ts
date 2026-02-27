import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../core/service/user.service';
import { Login } from '../../core/models/Login';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    const { login, password } = this.loginForm.value;

    this.authService.login(login, password)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (res) => {
        console.log('👉 Connexion Backend réussie ✅', res);
        // redirection vers la page d'accueil /students
        this.router.navigate(['/students']);
      },
      error: (err) => {
        console.log('👉 Connexion Backend échouée ❌', err);
        this.errorMessage = 'Login ou mot de passe incorrect ❌';
      }
    });
  }
}
