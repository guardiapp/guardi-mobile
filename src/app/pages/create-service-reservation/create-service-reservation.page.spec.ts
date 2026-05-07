import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateServiceReservationPage } from './create-service-reservation.page';

describe('CreateServiceReservationPage', () => {
  let component: CreateServiceReservationPage;
  let fixture: ComponentFixture<CreateServiceReservationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServiceReservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
