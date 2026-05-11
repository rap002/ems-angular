import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ProjectAddComponent } from './project-add'



describe('ProjectAddComponent', () => {
  let component: ProjectAddComponent;
  let fixture: ComponentFixture<ProjectAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectAddComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
