import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusRamsellInfoComponent } from './status-ramsell-info.component';

describe('StatusRamsellInfoComponent', () => {
  let component: StatusRamsellInfoComponent;
  let fixture: ComponentFixture<StatusRamsellInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusRamsellInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusRamsellInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
