import DeviceTokenService from "./deviceTokenService";

class DeviceTokenController {
  static async register(req, res) {
    const deviceToken = await DeviceTokenService.registerDeviceToken({
      authUser: req.user,
      body: req.body,
    });

    return res.send({
      message: "Device token registered successfully.",
      data: deviceToken,
    });
  }

  static async remove(req, res) {
    await DeviceTokenService.removeDeviceToken({
      authUser: req.user,
      body: req.body,
    });

    return res.send({
      message: "Device token removed successfully.",
    });
  }
}

export default DeviceTokenController;
