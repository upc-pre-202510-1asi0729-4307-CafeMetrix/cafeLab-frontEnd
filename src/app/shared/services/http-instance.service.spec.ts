import { TestBed } from '@angular/core/testing';

import { HttpInstanceService } from './http-instance.service';

describe('HttpInstanceService', () => {
  let service: HttpInstanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpInstanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
