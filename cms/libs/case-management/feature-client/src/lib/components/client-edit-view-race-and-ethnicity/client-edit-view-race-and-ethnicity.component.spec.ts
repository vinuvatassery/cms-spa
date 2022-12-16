import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditViewRaceAndEthnicityComponent } from './client-edit-view-race-and-ethnicity.component';

describe('ClientEditViewRaceAndEthnicityComponent', () => {
  let component: ClientEditViewRaceAndEthnicityComponent;
  let fixture: ComponentFixture<ClientEditViewRaceAndEthnicityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientEditViewRaceAndEthnicityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientEditViewRaceAndEthnicityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
