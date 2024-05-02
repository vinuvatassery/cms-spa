import { TestBed } from '@angular/core/testing';
import { CpAppComponent } from './app.component';

describe('CpAppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CpAppComponent, NxWelcomeComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CpAppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'cms'`, () => {
    const fixture = TestBed.createComponent(CpAppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('cms');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CpAppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome cms');
  });
});
