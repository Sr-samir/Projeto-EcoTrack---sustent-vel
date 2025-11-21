import { TestBed } from '@angular/core/testing';

import { AcoesServicesService } from './acoes-services.service';

describe('AcoesServicesService', () => {
  let service: AcoesServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcoesServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
