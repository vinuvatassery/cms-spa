import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionbuttonListComponent } from './optionbutton-list.component';

describe('OptionbuttonListComponent', () => {
  let component: OptionbuttonListComponent;
  let fixture: ComponentFixture<OptionbuttonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptionbuttonListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OptionbuttonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
