import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GantiPasswordPage } from './ganti-password.page';

describe('GantiPasswordPage', () => {
  let component: GantiPasswordPage;
  let fixture: ComponentFixture<GantiPasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GantiPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
