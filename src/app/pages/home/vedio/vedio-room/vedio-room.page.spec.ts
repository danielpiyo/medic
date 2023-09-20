import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VedioRoomPage } from './vedio-room.page';

describe('VedioRoomPage', () => {
  let component: VedioRoomPage;
  let fixture: ComponentFixture<VedioRoomPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VedioRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
