import GoalService from "./goalService";
import CustomHelper from "../common/helpers/customHelper";

class GoalController {
  static async create(req, res) {
    await GoalService.createGoal({
      authUser: req.user,
      body: req.body,
    });

    return CustomHelper.success(res, "Goal created successfully.", null, null, 201);
  }

  static async getSummary(req, res) {
    const goalSummary = await GoalService.getGoalSummary({
      authUser: req.user,
      query: req.query,
    });

    const mapGenerationAudio = (generation) => {
      if (!generation) {
        return null;
      }

      return {
        id: generation.id,
        generationDate: generation.generationDate,
        generationStatus: generation.generationStatus,
        delivered: generation.delivered,
        deliveredAt: generation.deliveredAt,
        audioUrl: generation?.audio?.audioUrl || null,
      };
    };

    const currentGoal = goalSummary?.data?.currentGoal;
    const history = Array.isArray(goalSummary?.data?.history)
      ? goalSummary.data.history
      : [];

    const data = {
      currentGoal: currentGoal
        ? {
            id: currentGoal.id,
            dream: currentGoal.dream,
            reminderTime: currentGoal.reminderTime,
            reminderEnabled: currentGoal.reminderEnabled,
            latestGeneration: mapGenerationAudio(currentGoal.latestGeneration),
          }
        : null,
      history: history.map((item) => ({
        date: item.date,
        audio: item?.goal?.latestGeneration
          ? {
              generationId: item.goal.latestGeneration.id,
              generationStatus: item.goal.latestGeneration.generationStatus,
              delivered: item.goal.latestGeneration.delivered,
              deliveredAt: item.goal.latestGeneration.deliveredAt,
              audioUrl: item.goal.latestGeneration?.audio?.audioUrl || null,
            }
          : null,
      })),
    };

    return CustomHelper.success(
      res,
      "Goal summary fetched successfully.",
      data,
      goalSummary.meta
    );
  }

  static async toggleReminder(req, res) {
    await GoalService.toggleReminder({
      authUser: req.user,
      goalId: req.params.id,
      body: req.body,
    });

    return CustomHelper.success(res, "User reminder updated successfully.");
  }

  static async getGodWhispers(req, res) {
    const godWhispers = await GoalService.getGodWhispers({
      query: req.query,
    });

    return CustomHelper.success(
      res,
      "God whispers fetched successfully.",
      godWhispers.data,
      godWhispers.meta
    );
  }
}

export default GoalController;
