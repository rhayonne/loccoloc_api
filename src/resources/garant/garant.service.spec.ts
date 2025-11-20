import { Test, TestingModule } from '@nestjs/testing';
import { GarantService } from './garant.service';

describe('GarantService', () => {
  let service: GarantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GarantService],
    }).compile();

    service = module.get<GarantService>(GarantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
