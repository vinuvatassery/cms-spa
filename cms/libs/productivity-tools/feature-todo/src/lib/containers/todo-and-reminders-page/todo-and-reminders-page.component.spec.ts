import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoAndRemindersPageComponent } from './todo-and-reminders-page.component';
import { Store, StoreModule } from '@ngrx/store';

describe('TodoAndRemindersPageComponent', () => {
  let component: TodoAndRemindersPageComponent;
  let fixture: ComponentFixture<TodoAndRemindersPageComponent>;
  let store: Store;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [TodoAndRemindersPageComponent],
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoAndRemindersPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
