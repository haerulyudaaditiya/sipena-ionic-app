import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailSlipGajiPage } from './detail-slip-gaji.page';

describe('DetailSlipGajiPage', () => {
  let component: DetailSlipGajiPage;
  let fixture: ComponentFixture<DetailSlipGajiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSlipGajiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
