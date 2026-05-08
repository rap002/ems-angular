import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentAdd } from './department-add';

describe('DepartmentAdd', () => {
  let component: DepartmentAdd;
  let fixture: ComponentFixture<DepartmentAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
