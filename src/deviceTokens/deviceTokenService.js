import DeviceToken from "../../model/deviceToken";
import User from "../../model/user";
import CommonService from "../common/services/common.service";
import {
  ForbiddenException,
  PreconditionFailedException,
} from "../common/error-exceptions";

class DeviceTokenService {
  static async registerDeviceToken({ authUser, body }) {
    const user = await CommonService.findByPk(User, authUser.id);

    if (!user) {
      throw new PreconditionFailedException("User not exist with this id.");
    }

    if (user.isDeleted) {
      throw new ForbiddenException("This account has been deleted.");
    }

    const existingToken = await CommonService.findOne(DeviceToken, {
        fcmToken: body.fcmToken,
    });

    if (existingToken) {
      existingToken.userId = user.id;
      existingToken.platform = body.platform;
      existingToken.deviceId = body.deviceId;
      existingToken.isActive = true;
      existingToken.lastUsedAt = new Date();
      await existingToken.save();
      return existingToken;
    }

    const existingDeviceToken = await CommonService.findOne(DeviceToken, {
        userId: user.id,
        deviceId: body.deviceId,
    });

    if (existingDeviceToken) {
      existingDeviceToken.fcmToken = body.fcmToken;
      existingDeviceToken.platform = body.platform;
      existingDeviceToken.isActive = true;
      existingDeviceToken.lastUsedAt = new Date();
      await existingDeviceToken.save();
      return existingDeviceToken;
    }

    return CommonService.createOne(DeviceToken, {
      userId: user.id,
      fcmToken: body.fcmToken,
      platform: body.platform,
      deviceId: body.deviceId,
      isActive: true,
      lastUsedAt: new Date(),
    });
  }

  static async removeDeviceToken({ authUser, body }) {
    const user = await CommonService.findByPk(User, authUser.id);

    if (!user) {
      throw new PreconditionFailedException("User not exist with this id.");
    }

    if (user.isDeleted) {
      throw new ForbiddenException("This account has been deleted.");
    }

    const deviceToken = await CommonService.findOne(DeviceToken, {
        userId: user.id,
        fcmToken: body.fcmToken,
    });

    if (!deviceToken) {
      throw new PreconditionFailedException(
        "Device token not exist with this token."
      );
    }

    deviceToken.isActive = false;
    deviceToken.lastUsedAt = new Date();
    await deviceToken.save();

    return true;
  }

  static async markTokensInactiveByValue(fcmTokens = []) {
    if (!fcmTokens.length) {
      return 0;
    }

    const [updatedCount] = await DeviceToken.update(
      {
        isActive: false,
        lastUsedAt: new Date(),
      },
      {
        where: {
          fcmToken: fcmTokens,
        },
      }
    );

    return updatedCount;
  }

  static async getActiveTokensByUserIds(userIds = []) {
    const normalizedUserIds = Array.from(new Set((userIds || []).filter(Boolean)));

    if (!normalizedUserIds.length) {
      return [];
    }

    return CommonService.findAll(DeviceToken, {
      where: {
        userId: normalizedUserIds,
        isActive: true,
      },
      attributes: ["id", "userId", "fcmToken", "platform", "deviceId", "lastUsedAt"],
    });
  }
}

export default DeviceTokenService;
