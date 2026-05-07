import { Component, forwardRef, Input, OnInit } from '@angular/core';

import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor/control-value-accessor.directive';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

type InputType = 'text' | 'number' | 'email' | 'password';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() type: InputType = 'text';
  @Input() inputId: string = '';
  @Input() placeholder: string = '';
  @Input() clearInput: boolean = false;
  @Input() toggleVisibility: boolean = false;
  @Input() label: string = '';
  isFocused: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }

  togglePasswordVisibility() {
    this.type = this.type === 'password' ? 'text' : 'password';
  }
}
