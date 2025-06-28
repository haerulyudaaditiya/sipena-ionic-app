import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailAbsensiPage } from './detail-absensi.page';

describe('DetailAbsensiPage', () => {
  let component: DetailAbsensiPage;
  let fixture: ComponentFixture<DetailAbsensiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAbsensiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
