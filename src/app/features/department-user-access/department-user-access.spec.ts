import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentUserAccess } from './department-user-access';

describe('DepartmentUserAccess', () => {
  let component: DepartmentUserAccess;
  let fixture: ComponentFixture<DepartmentUserAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentUserAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentUserAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
