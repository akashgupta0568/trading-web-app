import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TradePage } from './trade.page';

describe('TradePage', () => {
  let component: TradePage;
  let fixture: ComponentFixture<TradePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TradePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
