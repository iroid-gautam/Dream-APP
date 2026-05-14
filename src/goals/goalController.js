import GoalService from "./goalService";

class GoalController {
  static async create(req, res) {
    const goal = await GoalService.createGoal({
      authUser: req.user,
      body: req.body,
    });

    return res.status(201).send({
      message: "Goal saved successfully.",
      data: goal,
    });
  }

  static async getSummary(req, res) {
    const goalSummary = await GoalService.getGoalSummary({
      authUser: req.user,
      query: req.query,
    });

    return res.send(goalSummary);
  }

  static async toggleReminder(req, res) {
    const goal = await GoalService.toggleReminder({
      authUser: req.user,
      goalId: req.params.id,
      body: req.body,
    });

    return res.send({
      message: "Goal reminder updated successfully.",
      data: goal,
    });
  }

  static async getGodWhispers(req, res) {
    const godWhispers = await GoalService.getGodWhispers({
      query: req.query,
    });

    return res.send(godWhispers);
  }
}

export default GoalController;
