import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserGuidePage } from './user-guide.page';

describe('UserGuidePage', () => {
  let component: UserGuidePage;
  let fixture: ComponentFixture<UserGuidePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGuidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
