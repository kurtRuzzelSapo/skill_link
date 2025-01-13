import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTemplateDemoComponent } from './menu-template-demo.component';

describe('MenuTemplateDemoComponent', () => {
  let component: MenuTemplateDemoComponent;
  let fixture: ComponentFixture<MenuTemplateDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuTemplateDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuTemplateDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
