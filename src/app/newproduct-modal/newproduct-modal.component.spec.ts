import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewproductModalComponent } from './newproduct-modal.component';

describe('NewproductModalComponent', () => {
  let component: NewproductModalComponent;
  let fixture: ComponentFixture<NewproductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewproductModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewproductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
