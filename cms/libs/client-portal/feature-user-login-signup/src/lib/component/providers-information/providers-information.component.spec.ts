import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProvidersInformationComponent } from './providers-information.component';

describe('ProvidersInformationComponent', () => {
  let component: ProvidersInformationComponent;
  let fixture: ComponentFixture<ProvidersInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvidersInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProvidersInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
