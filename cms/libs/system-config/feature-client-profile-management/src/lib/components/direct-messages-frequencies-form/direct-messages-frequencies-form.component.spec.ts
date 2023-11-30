import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectMessagesFrequenciesFormComponent } from './direct-messages-frequencies-form.component';

describe('DirectMessagesFrequenciesFormComponent', () => {
  let component: DirectMessagesFrequenciesFormComponent;
  let fixture: ComponentFixture<DirectMessagesFrequenciesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectMessagesFrequenciesFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectMessagesFrequenciesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
