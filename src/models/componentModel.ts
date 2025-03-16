import {
  model,
  Model,
  Schema,
  Document,
  SchemaTimestampsConfig,
} from 'mongoose';

export interface IComponent extends Document, SchemaTimestampsConfig {
  name: string;
  level: number;
  weight: number;
}

const componentSchema = new Schema<IComponent, Model<IComponent>>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Component name is required'],
      trim: true,
    },
    level: {
      type: Number,
      enum: [1, 2, 3],
      required: [true, 'Component level is required'],
    },
    weight: {
      type: Number,
      require: [true, 'Audit must have weight'],
      default: 1,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

export const Component = model('Component', componentSchema);
