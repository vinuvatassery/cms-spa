import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RacialOrEthnicIdentityPageComponent } from './racial-or-ethnic-identity-page.component';

describe('RacialOrEthnicIdentityPageComponent', () => {
  let component: RacialOrEthnicIdentityPageComponent;
  let fixture: ComponentFixture<RacialOrEthnicIdentityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RacialOrEthnicIdentityPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RacialOrEthnicIdentityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
