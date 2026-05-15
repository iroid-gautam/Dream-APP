import HelpSupportService from "./helpSupportService";
import CustomHelper from "../common/helpers/customHelper";

class HelpSupportController {
  static async create(req, res) {
    const helpSupportRequest = await HelpSupportService.createHelpSupportRequest({
      authUser: req.user,
      body: req.body,
    });

    return CustomHelper.success(
      res,
      "Help and support request submitted successfully.",
      helpSupportRequest,
      null,
      201
    );
  }
}

export default HelpSupportController;
