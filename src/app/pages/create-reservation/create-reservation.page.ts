import { Component, inject, OnInit, signal } from '@angular/core';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/core/models/auth.state.interface';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.page.html',
  styleUrls: ['./create-reservation.page.scss'],
})
export class CreateReservationPage implements OnInit {
  private route = inject(ActivatedRoute);
  public user = signal<User | undefined>(undefined);
  public buildingSelected = signal<number | null>(null);
  faChevronLeft = faChevronLeft;
  title: string = '';
  reservationType: number | null = null;

  constructor() {}

  ngOnInit(): void {
    this.route.params.subscribe(({ name, id }) => {
      this.title = name;
      this.reservationType = id;
    });
  }
}
