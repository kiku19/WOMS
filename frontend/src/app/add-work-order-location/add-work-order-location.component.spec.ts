import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkOrderLocationComponent } from './add-work-order-location.component';

describe('AddWorkOrderLocationComponent', () => {
  let component: AddWorkOrderLocationComponent;
  let fixture: ComponentFixture<AddWorkOrderLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorkOrderLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorkOrderLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
