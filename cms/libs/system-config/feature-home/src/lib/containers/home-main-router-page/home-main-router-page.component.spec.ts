import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeMainRouterPageComponent } from './home-main-router-page.component';

describe('HomeMainRouterPageComponent', () => {
  let component: HomeMainRouterPageComponent;
  let fixture: ComponentFixture<HomeMainRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeMainRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeMainRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
