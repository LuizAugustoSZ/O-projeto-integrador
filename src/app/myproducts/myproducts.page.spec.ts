import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyproductsPage } from './myproducts.page';

describe('MyproductsPage', () => {
  let component: MyproductsPage;
  let fixture: ComponentFixture<MyproductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyproductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
