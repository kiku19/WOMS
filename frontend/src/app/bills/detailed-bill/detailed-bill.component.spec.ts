import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedBillComponent } from './detailed-bill.component';

describe('DetailedBillComponent', () => {
  let component: DetailedBillComponent;
  let fixture: ComponentFixture<DetailedBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
