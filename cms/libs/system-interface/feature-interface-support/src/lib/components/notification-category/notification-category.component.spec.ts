import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationCategoryComponent } from './error-category.component';

describe('NotificationCategoryComponent', () => {
  let component: NotificationCategoryComponent;
  let fixture: ComponentFixture<NotificationCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
