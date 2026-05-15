export default class GetGoalResource {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.username = data.username;
    this.dream = data.dream;
    this.godWhisperIds = Array.isArray(data.godWhisperIds)
      ? data.godWhisperIds
      : [];
    this.godWhispers = Array.isArray(data.godWhispers)
      ? data.godWhispers.map((whisper) => ({
          id: whisper.id,
          message: whisper.message,
        }))
      : [];
    this.reminderTime = data.reminderTime;
    this.timezone = data.timezone;
    this.isActive = data.isActive;
    this.activatedAt = data.activatedAt;
    this.deactivatedAt = data.deactivatedAt;
    this.reminderEnabled = data.reminderEnabled;
    this.lastReminderSentAt = data.lastReminderSentAt;
    this.latestGeneration = data.latestGeneration || null;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
