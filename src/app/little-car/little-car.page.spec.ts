import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LittleCarPage } from './little-car.page';

describe('LittleCarPage', () => {
  let component: LittleCarPage;
  let fixture: ComponentFixture<LittleCarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LittleCarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
