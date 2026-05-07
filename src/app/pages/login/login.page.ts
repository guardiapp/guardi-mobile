import { LoadingController } from '@ionic/angular';
import { LocalStorageService } from './../../core/services/localstorage/localstorage.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from 'src/app/state/actions/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private store: Store = inject(Store);
  private localStorageSvc = inject(LocalStorageService);
  fb: FormBuilder = inject(FormBuilder);
  form!: FormGroup;
  credentials: any = null;
  isSubmitting: boolean = false; // Variable para controlar el estado del envío

  constructor() {}

  /**
   * The ngOnInit function initializes a form and populates it with credentials stored in local storage
   * if available.
   */
  ngOnInit() {
    this.initForm();
    this.credentials = JSON.parse(this.localStorageSvc.getItem('credentials'));
    if (this.credentials) {
      this.form.patchValue(this.credentials);
    }
  }

  /**
   * The `initForm` function initializes a form with fields for username, password, and a checkbox for
   * remembering the user.
   */
  initForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  /**
   * The `saveCredentials` function saves or removes credentials based on the value of the `rememberMe`
   * property.
   * @returns The `saveCredentials()` function returns nothing (`undefined`) explicitly, as there is no
   * `return` statement outside of the conditional logic.
   */
  saveCredentials() {
    const credentials = this.form.value;
    if (credentials.rememberMe) {
      this.localStorageSvc.setItem('credentials', JSON.stringify(credentials));
      return;
    }
    this.localStorageSvc.removeItem('credentials');
  }

  onSubmit() {
    if (this.isSubmitting) return; // Evitar múltiples envíos

    this.isSubmitting = true; // Marcar como enviando
    this.saveCredentials();
    const { password, email } = this.form.value;

    this.store.dispatch(login({ email, password }));

    // Simular finalización del envío (puedes reemplazar esto con la lógica real)
    setTimeout(() => {
      this.isSubmitting = false; // Restablecer el estado después del envío
    }, 3000);
  }
}
