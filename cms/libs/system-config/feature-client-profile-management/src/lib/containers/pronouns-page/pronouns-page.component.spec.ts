import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PronounsPageComponent } from './pronouns-page.component';

describe('PronounsPageComponent', () => {
  let component: PronounsPageComponent;
  let fixture: ComponentFixture<PronounsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PronounsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PronounsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
