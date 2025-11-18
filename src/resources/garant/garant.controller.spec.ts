import { Test, TestingModule } from '@nestjs/testing';
import { GarantController } from './garant.controller';
import { GarantService } from './garant.service';

describe('GarantController', () => {
  let controller: GarantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GarantController],
      providers: [GarantService],
    }).compile();

    controller = module.get<GarantController>(GarantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
