import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRecComponent } from './profile-rec.component';

describe('ProfileRecComponent', () => {
  let component: ProfileRecComponent;
  let fixture: ComponentFixture<ProfileRecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileRecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileRecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
