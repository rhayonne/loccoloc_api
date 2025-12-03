import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StatusContract, StatusRoomContract } from 'src/resources/support/enum';

export type ContractDocument = HydratedDocument<Contract>;

@Schema()
export class Contract {
  @Prop({ type: Types.ObjectId, ref: 'Rooms', required: true, index: true })
  roomId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Locataire', required: true })
  locataireId: Types.ObjectId;

  @Prop({})
  startDate: Date;

  @Prop({})
  endDate: Date;

  @Prop({ enum: StatusContract, default: StatusContract.FREE })
  statusRoom: StatusContract;

  @Prop({ default: null })
  statusLastChangedDate: Date;

  @Prop({ default: null })
  lastModifiedBy: string;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
