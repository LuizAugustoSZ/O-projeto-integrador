import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryPagePage } from './category-page.page';

describe('CategoryPagePage', () => {
  let component: CategoryPagePage;
  let fixture: ComponentFixture<CategoryPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
