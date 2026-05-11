import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EmployeeList } from './employee-list';
import { EmployeeService } from '../../../service/employee/employee-service';
import { vi } from 'vitest';

describe('EmployeeList', () => {

  let component: EmployeeList;
  let fixture: ComponentFixture<EmployeeList>;

  // Fake EmployeeService
  let employeeServiceMock: any;

  beforeEach(async () => {

    // Create fake service methods
    employeeServiceMock = {

      // Fake delete API
      deleteEmployee: vi.fn().mockReturnValue(of({}))

    };

    await TestBed.configureTestingModule({

      imports: [EmployeeList],

      providers: [

        // Replace real service with fake service
        {
          provide: EmployeeService,
          useValue: employeeServiceMock
        }

      ]

    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeList);

    component = fixture.componentInstance;
  });

  // Check component creation
  it('should create component', () => {

    expect(component).toBeTruthy();

  });

  // Check delete method
  it('should delete employee', () => {

    // Fake confirm popup
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    // Call delete method
    component.deleteEmployee('123');

    // Verify service call
    expect(employeeServiceMock.deleteEmployee)
      .toHaveBeenCalledWith('123');

  });

});