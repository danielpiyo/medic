import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MedicalSuggestionPage } from './medical-suggestion.page';

describe('MedicalSuggestionPage', () => {
  let component: MedicalSuggestionPage;
  let fixture: ComponentFixture<MedicalSuggestionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MedicalSuggestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
