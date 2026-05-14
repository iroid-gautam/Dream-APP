import HelpSupportRequest from "../../model/helpSupportRequest";
import User from "../../model/user";
import CommonService from "../common/services/common.service";
import {
  ForbiddenException,
  PreconditionFailedException,
} from "../common/error-exceptions";

class HelpSupportService {
  static async createHelpSupportRequest({ authUser, body }) {
    const user = await CommonService.findByPk(User, authUser.id);

    if (!user) {
      throw new PreconditionFailedException("User not exist with this id.");
    }

    if (user.isDeleted) {
      throw new ForbiddenException("This account has been deleted.");
    }

    return CommonService.createOne(HelpSupportRequest, {
      userId: user.id,
      type: body.type || "feedback",
      description: body.description,
    });
  }
}

export default HelpSupportService;
