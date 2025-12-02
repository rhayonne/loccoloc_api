import { Test, TestingModule } from '@nestjs/testing';
import { TypePropertyService } from './type_property.service';

describe('TypePropertyService', () => {
  let service: TypePropertyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypePropertyService],
    }).compile();

    service = module.get<TypePropertyService>(TypePropertyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
