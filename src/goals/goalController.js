import GoalService from "./goalService";
import CustomHelper from "../common/helpers/customHelper";

class GoalController {
  static async create(req, res) {
    const goal = await GoalService.createGoal({
      authUser: req.user,
      body: req.body,
    });

    return CustomHelper.success(res, "Goal saved successfully.", goal, null, 201);
  }

  static async getSummary(req, res) {
    const goalSummary = await GoalService.getGoalSummary({
      authUser: req.user,
      query: req.query,
    });

    return CustomHelper.success(
      res,
      "Goal summary fetched successfully.",
      goalSummary.data,
      goalSummary.meta
    );
  }

  static async toggleReminder(req, res) {
    const goal = await GoalService.toggleReminder({
      authUser: req.user,
      goalId: req.params.id,
      body: req.body,
    });

    return CustomHelper.success(res, "Goal reminder updated successfully.", goal);
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
