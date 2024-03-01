import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardRequestsComponent } from './card-requests.component';

describe('CardRequestsComponent', () => {
  let component: CardRequestsComponent;
  let fixture: ComponentFixture<CardRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardRequestsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
