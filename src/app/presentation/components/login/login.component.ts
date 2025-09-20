import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginUserUseCase } from '../../../application/use-cases/auth/login-user.use-case';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/register-user.use-case';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoginMode = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loginUserUseCase: LoginUserUseCase,
    private registerUserUseCase: RegisterUserUseCase
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: [''],
      identification: ['']
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    
    if (this.isLoginMode) {
      this.loginForm.get('name')?.clearValidators();
      this.loginForm.get('identification')?.clearValidators();
    } else {
      this.loginForm.get('name')?.setValidators([Validators.required]);
      this.loginForm.get('identification')?.setValidators([Validators.required]);
    }
    
    this.loginForm.get('name')?.updateValueAndValidity();
    this.loginForm.get('identification')?.updateValueAndValidity();
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      if (this.isLoginMode) {
        await this.handleLogin();
      } else {
        await this.handleRegister();
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'An error occurred';
    } finally {
      this.isLoading = false;
    }
  }

  private async handleLogin(): Promise<void> {
    const { email, password } = this.loginForm.value;
    await this.loginUserUseCase.execute({ email, password });
    
    // Obtener la URL de retorno o usar /comics por defecto
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/comics';
    this.router.navigate([returnUrl]);
  }

  private async handleRegister(): Promise<void> {
    const { name, identification, email, password } = this.loginForm.value;
    await this.registerUserUseCase.execute({ name, identification, email, password });
    
    // Obtener la URL de retorno o usar /comics por defecto
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/comics';
    this.router.navigate([returnUrl]);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['email']) {
        return 'Invalid email format';
      }
      if (field.errors['minlength']) {
        return 'Password must be at least 6 characters';
      }
    }
    return '';
  }
}
