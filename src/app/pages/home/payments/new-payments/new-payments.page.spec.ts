import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPaymentsPage } from './new-payments.page';

describe('NewPaymentsPage', () => {
  let component: NewPaymentsPage;
  let fixture: ComponentFixture<NewPaymentsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewPaymentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
