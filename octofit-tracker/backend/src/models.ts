import { model, Schema, Types } from 'mongoose';

type UserDocument = {
  username: string;
  email: string;
  displayName: string;
  team?: Types.ObjectId;
};

type TeamDocument = {
  name: string;
  description?: string;
  members: Types.ObjectId[];
  points: number;
};

type ActivityDocument = {
  user: Types.ObjectId;
  type: string;
  durationMinutes: number;
  calories?: number;
  completedAt: Date;
};

type LeaderboardEntryDocument = {
  user: Types.ObjectId;
  points: number;
  period: string;
};

type WorkoutDocument = {
  title: string;
  description: string;
  activityType: string;
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};

export const User = model<UserDocument>(
  'User',
  new Schema<UserDocument>(
    {
      username: { type: String, required: true, unique: true, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      displayName: { type: String, required: true, trim: true },
      team: { type: Schema.Types.ObjectId, ref: 'Team' },
    },
    { timestamps: true },
  ),
);

export const Team = model<TeamDocument>(
  'Team',
  new Schema<TeamDocument>(
    {
      name: { type: String, required: true, trim: true },
      description: { type: String, trim: true },
      members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      points: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true },
  ),
);

export const Activity = model<ActivityDocument>(
  'Activity',
  new Schema<ActivityDocument>(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      type: { type: String, required: true, trim: true },
      durationMinutes: { type: Number, required: true, min: 1 },
      calories: { type: Number, min: 0 },
      completedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
  ),
);

export const LeaderboardEntry = model<LeaderboardEntryDocument>(
  'LeaderboardEntry',
  new Schema<LeaderboardEntryDocument>(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      points: { type: Number, required: true, default: 0, min: 0 },
      period: { type: String, required: true, default: 'all-time' },
    },
    { timestamps: true },
  ),
);

export const Workout = model<WorkoutDocument>(
  'Workout',
  new Schema<WorkoutDocument>(
    {
      title: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      activityType: { type: String, required: true, trim: true },
      durationMinutes: { type: Number, required: true, min: 1 },
      difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true,
      },
    },
    { timestamps: true },
  ),
);