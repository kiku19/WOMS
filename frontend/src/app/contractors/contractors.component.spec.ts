import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorsComponent } from './contractors.component';

describe('ContractorsComponent', () => {
  let component: ContractorsComponent;
  let fixture: ComponentFixture<ContractorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
