import HelpSupportService from "./helpSupportService";

class HelpSupportController {
  static async create(req, res) {
    const helpSupportRequest = await HelpSupportService.createHelpSupportRequest({
      authUser: req.user,
      body: req.body,
    });

    return res.status(201).send({
      message: "Help and support request submitted successfully.",
      data: helpSupportRequest,
    });
  }
}

export default HelpSupportController;
