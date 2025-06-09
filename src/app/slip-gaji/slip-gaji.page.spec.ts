import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlipGajiPage } from './slip-gaji.page';

describe('SlipGajiPage', () => {
  let component: SlipGajiPage;
  let fixture: ComponentFixture<SlipGajiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SlipGajiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
