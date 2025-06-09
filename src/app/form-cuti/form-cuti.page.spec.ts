import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCutiPage } from './form-cuti.page';

describe('FormCutiPage', () => {
  let component: FormCutiPage;
  let fixture: ComponentFixture<FormCutiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCutiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
