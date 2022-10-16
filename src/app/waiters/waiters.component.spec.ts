import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitersComponent } from './waiters.component';

describe('WaitersComponent', () => {
  let component: WaitersComponent;
  let fixture: ComponentFixture<WaitersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
