import { CommonModule } from '@angular/common';
import { Component, inject, Input, input, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Visitor } from 'src/app/core/models/visitor.state';
import { VisitorService } from 'src/app/core/services/visitor/visitor.service';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-select-visitor-modal',
  standalone: true,
  templateUrl: './select-visitor-modal.component.html',
  styleUrls: ['./select-visitor-modal.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
})
export class SelectVisitorModalComponent implements OnInit {
  @Input() residentId!: number;
  private fb = inject(FormBuilder);
  private visitorService = inject(VisitorService);
  private modalSvc = inject(ModalService);

  public visitors = signal<Visitor[]>([]);
  public isLoading = signal<boolean>(false);
  public searchForm = this.fb.group({ search: [''] });

  ngOnInit(): void {
    this.fetchVisitors('');

    this.searchForm
      .get('search')!
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        const q = (term || '').toString().trim();
        this.fetchVisitors(q);
      });
  }

  ionViewWillEnter() {
    this.fetchVisitors('');
    console.log(this.residentId);
  }

  private fetchVisitors(query?: string) {
    const residentId = this.residentId;
    // if (!residentId) return;
    this.isLoading.set(true);
    this.visitorService
      .getVisitors(residentId, query || undefined)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(({ data }) => this.visitors.set(data ?? []));
  }

  select(visitor: Visitor) {
    this.modalSvc.dismissModal({ visitor });
  }

  close() {
    this.modalSvc.dismissModal();
  }
}
