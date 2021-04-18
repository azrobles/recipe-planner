import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from '../app-routing.module';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports: [
        AppRoutingModule,
        NgbModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have isCollapsed initialize to true`, () => {
    expect(component.isCollapsed).toBe(true);
  });

  it(`should have isCollapsed as true when clicked (nav-link.click)`, () => {
    component.isCollapsed = false;

    const compiled = fixture.nativeElement;
    compiled.querySelector('.nav-link').click();
    expect(component.isCollapsed).toBe(true);
  });
});
