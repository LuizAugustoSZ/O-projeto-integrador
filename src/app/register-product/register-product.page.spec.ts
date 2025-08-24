import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterProductPage } from './register-product.page';

describe('RegisterProductPage', () => {
  let component: RegisterProductPage;
  let fixture: ComponentFixture<RegisterProductPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
