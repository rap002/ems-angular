import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDeleteUpdate } from './project-delete-update';

describe('ProjectDeleteUpdate', () => {
  let component: ProjectDeleteUpdate;
  let fixture: ComponentFixture<ProjectDeleteUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDeleteUpdate],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDeleteUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
