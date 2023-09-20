import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NurseMenuPage } from './nurse-menu.page';

describe('NurseMenuPage', () => {
  let component: NurseMenuPage;
  let fixture: ComponentFixture<NurseMenuPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NurseMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
