import DeviceTokenService from "./deviceTokenService";
import CustomHelper from "../common/helpers/customHelper";

class DeviceTokenController {
  static async register(req, res) {
    const deviceToken = await DeviceTokenService.registerDeviceToken({
      authUser: req.user,
      body: req.body,
    });

    return CustomHelper.success(
      res,
      "Device token registered successfully.",
      deviceToken
    );
  }

  static async remove(req, res) {
    await DeviceTokenService.removeDeviceToken({
      authUser: req.user,
      body: req.body,
    });

    return CustomHelper.success(res, "Device token removed successfully.");
  }
}

export default DeviceTokenController;
