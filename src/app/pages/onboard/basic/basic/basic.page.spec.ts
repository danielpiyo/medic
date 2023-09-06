import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicPage } from './basic.page';

describe('BasicPage', () => {
  let component: BasicPage;
  let fixture: ComponentFixture<BasicPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BasicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
