import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PcaCodesPageComponent } from './pca-codes-page.component';

describe('PcaCodesPageComponent', () => {
  let component: PcaCodesPageComponent;
  let fixture: ComponentFixture<PcaCodesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PcaCodesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PcaCodesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
