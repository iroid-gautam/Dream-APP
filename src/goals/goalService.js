import Goal from "../../model/goal";
import User from "../../model/user";
import GodWhisper from "../../model/godWhisper";
import sequelize from "../../model/connection";
import CommonService from "../common/services/common.service";
import GetGoalResource from "./resources/getGoalResource";
import GetGoalHistoryDayResource from "./resources/getGoalHistoryDayResource";
import {
  BadRequestException,
  ForbiddenException,
  PreconditionFailedException,
} from "../common/error-exceptions";

class GoalService {
  static async ensureValidActiveUser(authUserId) {
    const user = await CommonService.findByPk(User, authUserId);

    if (!user) {
      throw new PreconditionFailedException("User not exist with this id.");
    }

    if (user.isDeleted) {
      throw new ForbiddenException("This account has been deleted.");
    }

    return user;
  }

  static async buildPaginatedGoalHistory({ userId, query }) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    const rows = await CommonService.findAll(Goal, {
      where: {
        userId,
        isActive: false,
      },
      order: [
        ["deactivatedAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    const whisperIds = Array.from(
      new Set(
        rows
          .flatMap((goal) =>
            Array.isArray(goal.godWhisperIds) ? goal.godWhisperIds : []
          )
          .filter(Boolean)
      )
    );
    const godWhispers = whisperIds.length
      ? await CommonService.findAll(GodWhisper, {
          where: {
            id: whisperIds,
          },
        })
      : [];

    const whisperMap = new Map(
      godWhispers.map((whisper) => [whisper.id, whisper])
    );

    const expandedGoalDays = rows.flatMap((goal) => {
      const selectedWhispers = (goal.godWhisperIds || [])
        .map((id) => whisperMap.get(id))
        .filter(Boolean);
      const resourceGoal = this.transformGoal(goal, selectedWhispers);

      return this.expandGoalToHistoryDays(resourceGoal);
    });

    expandedGoalDays.sort((a, b) => new Date(b.date) - new Date(a.date));

    const total = expandedGoalDays.length;
    const offset = (page - 1) * limit;
    const pagedHistory = expandedGoalDays.slice(offset, offset + limit);

    return {
      history: pagedHistory,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  static async createGoal({ authUser, body }) {
    return sequelize.transaction(async (transaction) => {
      const user = await CommonService.findByPk(User, authUser.id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!user) {
        throw new PreconditionFailedException("User not exist with this id.");
      }

      if (user.isDeleted) {
        throw new ForbiddenException("This account has been deleted.");
      }

      const selectedGodWhispers = await this.findActiveGodWhispersByIds({
        ids: body.godWhisperIds,
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      const activeGoal = await CommonService.findOne(
        Goal,
        {
          userId: user.id,
          isActive: true,
        },
        {
          order: [["createdAt", "DESC"]],
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      if (activeGoal) {
        activeGoal.isActive = false;
        activeGoal.deactivatedAt = new Date();
        await activeGoal.save({ transaction });
      }

      const goal = await CommonService.createOne(
        Goal,
        {
          userId: user.id,
          username: body.username,
          dream: body.dream,
          godWhisperIds: selectedGodWhispers.map((whisper) => whisper.id),
          reminderTime: body.reminderTime,
          timezone: body.timezone,
          isActive: true,
          activatedAt: new Date(),
          deactivatedAt: null,
          reminderEnabled: true,
          lastReminderSentAt: null,
        },
        { transaction }
      );

      return this.transformGoal(goal, selectedGodWhispers);
    });
  }

  static async getGoalSummary({ authUser, query }) {
    const user = await this.ensureValidActiveUser(authUser.id);

    const goal = await CommonService.findOne(
      Goal,
      {
        userId: user.id,
        isActive: true,
      },
      {
        order: [["createdAt", "DESC"]],
      }
    );

    let currentGoal = null;
    if (goal) {
      const godWhispers = await this.findGodWhispersByIds(goal.godWhisperIds);
      currentGoal = this.transformGoal(goal, godWhispers);
    }

    const { history, meta } = await this.buildPaginatedGoalHistory({
      userId: user.id,
      query,
    });

    return {
      data: {
        currentGoal,
        history,
      },
      meta,
    };
  }

  static async toggleReminder({ authUser, goalId, body }) {
    const user = await this.ensureValidActiveUser(authUser.id);

    const goal = await CommonService.findOne(Goal, {
        id: goalId,
        userId: user.id,
    });

    if (!goal) {
      throw new PreconditionFailedException("Goal not exist with this id.");
    }

    goal.reminderEnabled = body.reminderEnabled;
    await goal.save();

    const godWhispers = await this.findGodWhispersByIds(goal.godWhisperIds);
    return this.transformGoal(goal, godWhispers);
  }

  static async getGodWhispers({ query = {} }) {
    const godWhispers = await CommonService.findAll(GodWhisper, {
      where: {
        isActive: true,
      },
      order: [
        ["sortOrder", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    const mappedWhispers = godWhispers.map((godWhisper) => ({
      id: godWhisper.id,
      message: godWhisper.message,
      sortOrder: godWhisper.sortOrder,
    }));

    if (query.view === "all") {
      return {
        data: mappedWhispers,
      };
    }

    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const total = mappedWhispers.length;
    const offset = (page - 1) * limit;
    const pagedWhispers = mappedWhispers.slice(offset, offset + limit);

    return {
      data: pagedWhispers,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  static async findGodWhispersByIds(ids = []) {
    const uniqueIds = Array.from(new Set((ids || []).filter(Boolean)));
    if (!uniqueIds.length) {
      return [];
    }

    const whispers = await CommonService.findAll(GodWhisper, {
      where: {
        id: uniqueIds,
      },
    });
    const whisperMap = new Map(whispers.map((whisper) => [whisper.id, whisper]));

    return uniqueIds.map((id) => whisperMap.get(id)).filter(Boolean);
  }

  static async findActiveGodWhispersByIds({ ids = [], transaction, lock } = {}) {
    const uniqueIds = Array.from(new Set((ids || []).filter(Boolean)));
    if (!uniqueIds.length) {
      throw new BadRequestException("At least one god whisper is required.");
    }

    const godWhispers = await CommonService.findAll(GodWhisper, {
      where: {
        id: uniqueIds,
        isActive: true,
      },
      transaction,
      lock,
    });

    if (godWhispers.length !== uniqueIds.length) {
      throw new BadRequestException(
        "One or more selected god whispers are invalid."
      );
    }

    const whisperMap = new Map(
      godWhispers.map((whisper) => [whisper.id, whisper])
    );

    return uniqueIds.map((id) => whisperMap.get(id)).filter(Boolean);
  }

  static transformGoal(goal, godWhispers = []) {
    return new GetGoalResource({
      ...goal.get({ plain: true }),
      godWhispers: (godWhispers || []).map((godWhisper) => ({
        id: godWhisper.id,
        message: godWhisper.message,
      })),
    });
  }

  static expandGoalToHistoryDays(goal) {
    const activatedAt = goal?.activatedAt ? new Date(goal.activatedAt) : null;
    const deactivatedAt = goal?.deactivatedAt ? new Date(goal.deactivatedAt) : null;

    if (!activatedAt || !deactivatedAt) {
      return [];
    }

    const start = new Date(
      Date.UTC(
        activatedAt.getUTCFullYear(),
        activatedAt.getUTCMonth(),
        activatedAt.getUTCDate()
      )
    );
    const end = new Date(
      Date.UTC(
        deactivatedAt.getUTCFullYear(),
        deactivatedAt.getUTCMonth(),
        deactivatedAt.getUTCDate()
      )
    );

    if (start > end) {
      return [];
    }

    const historyDays = [];
    for (
      let cursor = new Date(start);
      cursor <= end;
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    ) {
      historyDays.push(
        new GetGoalHistoryDayResource({
          date: new Date(cursor).toISOString(),
          goal,
        })
      );
    }

    return historyDays;
  }
}

export default GoalService;
