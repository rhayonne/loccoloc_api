import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuditContractLogDocument = HydratedDocument<AuditContractLog>;

@Schema({ timestamps: true })
export class AuditContractLog {
  @Prop({ type: Types.ObjectId, required: true })
  documentId: Types.ObjectId;

  @Prop({ required: true })
  action: string;

  @Prop({})
  oldStatus: string;

  @Prop({})
  newStatus: string;

  @Prop({ default: 'System (Cron Job)' })
  userId: string;
}

export const AuditContractLogSchema =
  SchemaFactory.createForClass(AuditContractLog);
