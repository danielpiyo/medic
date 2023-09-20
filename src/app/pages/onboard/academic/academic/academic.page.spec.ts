import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AcademicPage } from './academic.page';

describe('AcademicPage', () => {
  let component: AcademicPage;
  let fixture: ComponentFixture<AcademicPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AcademicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
