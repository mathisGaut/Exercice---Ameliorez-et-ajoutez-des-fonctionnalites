import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: { register: jest.Mock };

  beforeEach(async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    userService = { register: jest.fn().mockReturnValue(of({})) };
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose form controls via form getter', () => {
    expect(component.form).toBe(component.registerForm.controls);
  });

  it('onSubmit with valid form should call UserService.register', () => {
    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: '1234',
    });
    component.onSubmit();
    expect(userService.register).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: '1234',
    });
  });

  it('onSubmit with invalid form should not call UserService.register', () => {
    component.registerForm.setValue({
      firstName: '',
      lastName: '',
      login: '',
      password: '',
    });
    component.onSubmit();
    expect(userService.register).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('onReset should reset submitted and form', () => {
    component.submitted = true;
    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: '1234',
    });
    component.onReset();
    expect(component.submitted).toBe(false);
    expect(component.registerForm.get('firstName')?.value).toBeNull();
  });

  afterEach(() => {
    (window.alert as jest.Mock).mockRestore();
  });
});
