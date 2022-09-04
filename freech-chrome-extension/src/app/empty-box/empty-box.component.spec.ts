import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyBoxComponent } from './empty-box.component';

describe('EmptyBoxComponent', () => {
  let component: EmptyBoxComponent;
  let fixture: ComponentFixture<EmptyBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
