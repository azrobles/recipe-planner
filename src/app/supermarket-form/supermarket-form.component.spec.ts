import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupermarketFormComponent } from './supermarket-form.component';

describe('SupermarketFormComponent', () => {
  let component: SupermarketFormComponent;
  let fixture: ComponentFixture<SupermarketFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupermarketFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupermarketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
