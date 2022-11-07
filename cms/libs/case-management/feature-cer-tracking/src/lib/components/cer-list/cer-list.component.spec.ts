import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerListComponent } from './cer-list.component';

describe('CerListComponent', () => {
  let component: CerListComponent;
  let fixture: ComponentFixture<CerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CerListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
