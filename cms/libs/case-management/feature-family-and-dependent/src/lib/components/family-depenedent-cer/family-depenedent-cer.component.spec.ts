import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDepenedentCerComponent } from './family-depenedent-cer.component';

describe('FamilyDepenedentCerComponent', () => {
  let component: FamilyDepenedentCerComponent;
  let fixture: ComponentFixture<FamilyDepenedentCerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyDepenedentCerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FamilyDepenedentCerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
