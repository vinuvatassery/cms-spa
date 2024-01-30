import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductivityToolsPageComponent } from './productivity-tools-page.component';

describe('ProductivityToolsPageComponent', () => {
  let component: ProductivityToolsPageComponent;
  let fixture: ComponentFixture<ProductivityToolsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductivityToolsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductivityToolsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
