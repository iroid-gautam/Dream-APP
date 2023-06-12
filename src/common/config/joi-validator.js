import expressJoiValidator from "express-joi-validation";

const validator = expressJoiValidator.createValidator({
    passError: true
})

module.exports = validator;