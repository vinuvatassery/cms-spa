import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMoreWidgetsContainerComponent } from './add-more-widgets-container.component';

describe('AddMoreWidgetsContainerComponent', () => {
  let component: AddMoreWidgetsContainerComponent;
  let fixture: ComponentFixture<AddMoreWidgetsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMoreWidgetsContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddMoreWidgetsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
