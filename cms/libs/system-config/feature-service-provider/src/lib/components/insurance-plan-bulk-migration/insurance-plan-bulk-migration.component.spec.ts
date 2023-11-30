import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsurancePlanBulkMigrationComponent } from './insurance-plan-bulk-migration.component';

describe('InsurancePlanBulkMigrationComponent', () => {
  let component: InsurancePlanBulkMigrationComponent;
  let fixture: ComponentFixture<InsurancePlanBulkMigrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsurancePlanBulkMigrationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsurancePlanBulkMigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
