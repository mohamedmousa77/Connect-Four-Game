import { TestBed } from '@angular/core/testing';

import { AiServicesService } from './ai-logic.service';

describe('AiServicesService', () => {
  let service: AiServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
