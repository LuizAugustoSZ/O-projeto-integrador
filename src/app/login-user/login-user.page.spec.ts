import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginUserPage } from './login-user.page';

describe('LoginUserPage', () => {
  let component: LoginUserPage;
  let fixture: ComponentFixture<LoginUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
