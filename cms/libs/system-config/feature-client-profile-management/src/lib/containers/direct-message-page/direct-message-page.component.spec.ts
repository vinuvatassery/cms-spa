import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectMessagePageComponent } from './direct-message-page.component';

describe('DirectMessagePageComponent', () => {
  let component: DirectMessagePageComponent;
  let fixture: ComponentFixture<DirectMessagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectMessagePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectMessagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
