import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { MaterialModule } from '../../shared/material.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: { login: ReturnType<typeof jest.fn> };
  let router: { navigate: ReturnType<typeof jest.fn> };

  beforeEach(async () => {
    const loginSpy = jest.fn().mockReturnValue(of('jwt-token'));
    const navigateSpy = jest.fn();
    authService = { login: loginSpy };
    router = { navigate: navigateSpy };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, MaterialModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose form controls via form getter', () => {
    expect(component.form).toBe(component.loginForm.controls);
  });

  it('onSubmit with valid form should call AuthService.login and navigate to /students', () => {
    component.loginForm.setValue({ login: 'user', password: 'pass' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith('user', 'pass');
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('onSubmit with invalid form should not call AuthService.login', () => {
    component.loginForm.setValue({ login: '', password: '' });
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('onSubmit on login error should set errorMessage', () => {
    authService.login.mockReturnValue(throwError(() => new Error('Unauthorized')));
    component.loginForm.setValue({ login: 'user', password: 'wrong' });
    component.onSubmit();
    expect(component.errorMessage).toBe('Login ou mot de passe incorrect ❌');
  });
});
