import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-companion-modal',
  templateUrl: './add-companion-modal.component.html',
  styleUrls: ['./add-companion-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class AddCompanionModalComponent implements OnInit {
  @Input() companion: any;
  companionForm!: FormGroup;
  modalTitle: string = 'Agregar Acompañante';

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
    if (this.companion) {
      this.modalTitle = 'Editar Acompañante';
      this.companionForm.patchValue(this.companion);
    }
  }

  initForm() {
    this.companionForm = this.fb.group({
      name: ['', Validators.required],
      documentId: ['', Validators.required],
    });
  }

  dismissModal(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  saveCompanion() {
    if (this.companionForm.valid) {
      this.dismissModal(this.companionForm.value);
    }
  }
}
