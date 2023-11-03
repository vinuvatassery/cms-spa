import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedClaimsListsComponent } from './imported-claims-lists.component';

describe('ImportedClaimsListsComponent', () => {
  let component: ImportedClaimsListsComponent;
  let fixture: ComponentFixture<ImportedClaimsListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportedClaimsListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportedClaimsListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
