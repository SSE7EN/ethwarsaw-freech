import { TestBed } from '@angular/core/testing';

import { CommentsUtilService } from './comments-util.service';

describe('CommentsReadService', () => {
  let service: CommentsUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentsUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
