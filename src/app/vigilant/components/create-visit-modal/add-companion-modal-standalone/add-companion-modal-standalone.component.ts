import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-companion-modal-standalone',
  templateUrl: './add-companion-modal-standalone.component.html',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class AddCompanionModalStandaloneComponent implements OnInit {
  @Input() companion: any;
  public form!: FormGroup;
  public modalTitle: string = 'Agregar Acompañante';

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
    if (this.companion) {
      this.modalTitle = 'Editar Acompañante';
      this.form.patchValue(this.companion);
    }
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      documentId: ['', Validators.required],
    });
  }

  close(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  save() {
    if (this.form.valid) {
      this.close(this.form.value);
    }
  }
}
