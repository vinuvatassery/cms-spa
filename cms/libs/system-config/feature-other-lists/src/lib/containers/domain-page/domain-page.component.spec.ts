import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomainPageComponent } from './domain-page.component';

describe('DomainPageComponent', () => {
  let component: DomainPageComponent;
  let fixture: ComponentFixture<DomainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DomainPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DomainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
