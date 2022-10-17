import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciboModalComponent } from './recibo-modal.component';

describe('ReciboModalComponent', () => {
  let component: ReciboModalComponent;
  let fixture: ComponentFixture<ReciboModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReciboModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReciboModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
