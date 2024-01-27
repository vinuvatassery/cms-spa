import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingSourcePageComponent } from './funding-source-page.component';

describe('FundingSourcePageComponent', () => {
  let component: FundingSourcePageComponent;
  let fixture: ComponentFixture<FundingSourcePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundingSourcePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FundingSourcePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
