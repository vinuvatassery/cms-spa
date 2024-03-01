import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FundsPageComponent } from './funds-page.component';

describe('FundsPageComponent', () => {
  let component: FundsPageComponent;
  let fixture: ComponentFixture<FundsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FundsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
