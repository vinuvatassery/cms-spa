import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpNavigationComponent } from './cp-navigation.component';

describe('CpNavigationComponent', () => {
  let component: CpNavigationComponent;
  let fixture: ComponentFixture<CpNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CpNavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CpNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
