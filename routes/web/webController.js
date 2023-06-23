


class webController {
    /**
	 * @description: terms & condition page
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	static async termsCondition(req, res, next) {
		return res.render('termsCondition')
	}


	/**
	 * @description: Privacy policy page
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	static async privacyPolicy(req, res, next) {
		return res.render('privacyPolicy')
	}

}

export default webController;