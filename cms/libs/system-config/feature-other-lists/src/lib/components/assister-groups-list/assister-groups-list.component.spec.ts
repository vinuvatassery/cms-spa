import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssisterGroupsListComponent } from './assister-groups-list.component';

describe('AssisterGroupsListComponent', () => {
  let component: AssisterGroupsListComponent;
  let fixture: ComponentFixture<AssisterGroupsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssisterGroupsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssisterGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
