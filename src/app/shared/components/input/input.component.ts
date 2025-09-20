import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: InputType = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() error: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';

  value: string = '';
  isFocused: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  get inputClasses(): string {
    const classes = ['input__field'];

    if (this.error) classes.push('input__field--error');
    if (this.disabled) classes.push('input__field--disabled');
    if (this.isFocused) classes.push('input__field--focused');
    if (this.icon && this.iconPosition === 'left') classes.push('input__field--with-icon-left');
    if (this.icon && this.iconPosition === 'right') classes.push('input__field--with-icon-right');

    return classes.join(' ');
  }

  get containerClasses(): string {
    const classes = ['input'];

    if (this.error) classes.push('input--error');
    if (this.disabled) classes.push('input--disabled');

    return classes.join(' ');
  }
}
