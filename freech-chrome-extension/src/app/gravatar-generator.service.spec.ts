import { TestBed } from '@angular/core/testing';

import { GravatarGeneratorService } from './gravatar-generator.service';

describe('GravatarGeneratorService', () => {
  let service: GravatarGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GravatarGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
