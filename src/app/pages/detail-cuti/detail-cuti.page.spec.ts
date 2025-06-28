import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailCutiPage } from './detail-cuti.page';

describe('DetailCutiPage', () => {
  let component: DetailCutiPage;
  let fixture: ComponentFixture<DetailCutiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCutiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
