import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NurseSettingsPage } from './nurse-settings.page';

describe('NurseSettingsPage', () => {
  let component: NurseSettingsPage;
  let fixture: ComponentFixture<NurseSettingsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NurseSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
