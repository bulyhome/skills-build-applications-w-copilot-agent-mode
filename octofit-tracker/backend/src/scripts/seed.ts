import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');
    console.log('Seed the octofit_db database with test data');

    const teamFixtures = [
      {
        name: 'Pulse Crew',
        description: 'A steady, all-around fitness team.',
        points: 420,
      },
      {
        name: 'Trail Blazers',
        description: 'Outdoor miles and weekend adventures.',
        points: 365,
      },
    ];
    const teams = new Map<string, InstanceType<typeof Team>>();

    for (const teamFixture of teamFixtures) {
      const team = await Team.findOneAndUpdate(
        { name: teamFixture.name },
        { $set: teamFixture },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      teams.set(team.name, team);
    }

    const userFixtures = [
      {
        username: 'amara.chen',
        email: 'amara.chen@example.com',
        displayName: 'Amara Chen',
        teamName: 'Pulse Crew',
      },
      {
        username: 'leo.martin',
        email: 'leo.martin@example.com',
        displayName: 'Leo Martin',
        teamName: 'Pulse Crew',
      },
      {
        username: 'priya.shah',
        email: 'priya.shah@example.com',
        displayName: 'Priya Shah',
        teamName: 'Trail Blazers',
      },
      {
        username: 'mateo.rivera',
        email: 'mateo.rivera@example.com',
        displayName: 'Mateo Rivera',
        teamName: 'Trail Blazers',
      },
    ];
    const users = new Map<string, InstanceType<typeof User>>();

    for (const userFixture of userFixtures) {
      const { teamName, ...userFields } = userFixture;
      const team = teams.get(teamName);
      if (!team) {
        throw new Error(`Seed team not found: ${teamName}`);
      }

      const user = await User.findOneAndUpdate(
        { username: userFields.username },
        { $set: { ...userFields, team: team._id } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      users.set(user.username, user);
    }

    for (const teamFixture of teamFixtures) {
      const memberIds = userFixtures
        .filter((user) => user.teamName === teamFixture.name)
        .map((user) => users.get(user.username)?._id)
        .filter((userId) => userId !== undefined);

      await Team.updateOne(
        { name: teamFixture.name },
        { $set: { members: memberIds } },
      );
    }

    const activityFixtures = [
      { username: 'amara.chen', type: 'Running', durationMinutes: 32, calories: 285, completedAt: '2026-09-27T07:30:00.000Z' },
      { username: 'leo.martin', type: 'Cycling', durationMinutes: 45, calories: 390, completedAt: '2026-09-27T08:15:00.000Z' },
      { username: 'priya.shah', type: 'Hiking', durationMinutes: 60, calories: 430, completedAt: '2026-09-26T09:00:00.000Z' },
      { username: 'mateo.rivera', type: 'Strength', durationMinutes: 40, calories: 310, completedAt: '2026-09-26T17:45:00.000Z' },
      { username: 'amara.chen', type: 'Yoga', durationMinutes: 25, calories: 105, completedAt: '2026-09-25T18:30:00.000Z' },
    ];

    for (const activityFixture of activityFixtures) {
      const user = users.get(activityFixture.username);
      if (!user) {
        throw new Error(`Seed user not found: ${activityFixture.username}`);
      }

      const { username, completedAt, ...activityFields } = activityFixture;
      const date = new Date(completedAt);
      await Activity.findOneAndUpdate(
        { user: user._id, type: activityFields.type, completedAt: date },
        { $set: { ...activityFields, user: user._id, completedAt: date } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    const leaderboardFixtures = [
      { username: 'amara.chen', points: 240, period: 'all-time' },
      { username: 'leo.martin', points: 180, period: 'all-time' },
      { username: 'priya.shah', points: 215, period: 'all-time' },
      { username: 'mateo.rivera', points: 150, period: 'all-time' },
    ];

    for (const leaderboardFixture of leaderboardFixtures) {
      const user = users.get(leaderboardFixture.username);
      if (!user) {
        throw new Error(`Seed user not found: ${leaderboardFixture.username}`);
      }

      await LeaderboardEntry.findOneAndUpdate(
        { user: user._id, period: leaderboardFixture.period },
        { $set: { user: user._id, points: leaderboardFixture.points, period: leaderboardFixture.period } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    const workoutFixtures = [
      {
        title: 'Easy Start Run',
        description: 'A relaxed run focused on building a comfortable pace.',
        activityType: 'Running',
        durationMinutes: 25,
        difficulty: 'beginner' as const,
      },
      {
        title: 'Bodyweight Strength Circuit',
        description: 'A balanced circuit of squats, push-ups, lunges, and planks.',
        activityType: 'Strength',
        durationMinutes: 35,
        difficulty: 'intermediate' as const,
      },
      {
        title: 'Recovery Flow',
        description: 'Gentle mobility and stretching for a recovery day.',
        activityType: 'Yoga',
        durationMinutes: 20,
        difficulty: 'beginner' as const,
      },
    ];

    for (const workoutFixture of workoutFixtures) {
      await Workout.findOneAndUpdate(
        { title: workoutFixture.title },
        { $set: workoutFixture },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
