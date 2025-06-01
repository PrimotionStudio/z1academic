import mongoose, { Schema, Document, Model } from "mongoose";

interface ISession extends Document {
  name: string;
  isActive: boolean;
}

interface ISessionModel extends Model<ISession> {
  toggleActive: (sessionId: string) => Promise<void>;
}

const SessionSchema = new Schema<ISession>(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

SessionSchema.statics.toggleActive = async function (sessionId: string) {
  await this.updateMany({}, { isActive: false });
  await this.findByIdAndUpdate(sessionId, { isActive: true });
};

export default (mongoose.models.Session as ISessionModel) ||
  mongoose.model<ISession, ISessionModel>("Session", SessionSchema);
