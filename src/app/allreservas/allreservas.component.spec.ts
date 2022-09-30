import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllreservasComponent } from './allreservas.component';

describe('AllreservasComponent', () => {
  let component: AllreservasComponent;
  let fixture: ComponentFixture<AllreservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllreservasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllreservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
