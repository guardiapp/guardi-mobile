import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VigilantPage } from './vigilant.page';

describe('VigilantPage', () => {
  let component: VigilantPage;
  let fixture: ComponentFixture<VigilantPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VigilantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
