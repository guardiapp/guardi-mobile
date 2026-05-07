import { Component, inject, Input, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Visitor } from 'src/app/core/models/visitor.state';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import {
  addVisitor,
  updateVisitor,
} from 'src/app/state/actions/visitor.actions';
import { selectApartmentId } from 'src/app/state/selectors/auth.selectors';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() visitor!: Visitor;
  public apartmentId = signal<number | null>(null);
  private store = inject(Store);
  private modalService = inject(ModalService);
  private fb: FormBuilder = inject(FormBuilder);
  public form!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.visitor;
    this.initForm();
    this.store.select(selectApartmentId).subscribe((apartmentId) => {
      this.apartmentId.set(apartmentId ?? null);
      this.form.patchValue({ apartment_id: apartmentId });
    });
    if (!!this.visitor) {
      this.form.patchValue(this.visitor);
    }
  }

  initForm() {
    this.form = this.fb.group({
      apartment_id: [this.apartmentId(), [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      document: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  close() {
    this.modalService.dismissModal();
  }
  onSubmit() {
    this.form.value;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    } else {
      const dto = this.form.value;

      if (this.visitor) {
        this.store.dispatch(updateVisitor({ id: this.visitor.id, dto }));
        return;
      }

      this.store.dispatch(addVisitor({ dto }));
    }
  }
}
