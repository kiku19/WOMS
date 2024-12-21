import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationRowComponent } from './location-row.component';

describe('LocationRowComponent', () => {
  let component: LocationRowComponent;
  let fixture: ComponentFixture<LocationRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
