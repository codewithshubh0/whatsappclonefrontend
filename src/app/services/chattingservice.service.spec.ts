import { TestBed } from '@angular/core/testing';

import { ChattingserviceService } from './chattingservice.service';

describe('ChattingserviceService', () => {
  let service: ChattingserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChattingserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
