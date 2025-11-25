import { Test, TestingModule } from '@nestjs/testing';
import { TypePropertyController } from './type_property.controller';
import { TypePropertyService } from './type_property.service';

describe('TypePropertyController', () => {
  let controller: TypePropertyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypePropertyController],
      providers: [TypePropertyService],
    }).compile();

    controller = module.get<TypePropertyController>(TypePropertyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
