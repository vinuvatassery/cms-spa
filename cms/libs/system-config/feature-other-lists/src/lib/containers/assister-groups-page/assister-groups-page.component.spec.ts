import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssisterGroupsPageComponent } from './assister-groups-page.component';

describe('AssisterGroupsPageComponent', () => {
  let component: AssisterGroupsPageComponent;
  let fixture: ComponentFixture<AssisterGroupsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssisterGroupsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssisterGroupsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
