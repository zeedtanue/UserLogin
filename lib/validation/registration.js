const { check,validationResult } = require('express-validator/check');

module.exports = (req, res)=> {
    check('name')
        .trim()
        .isLength({max: 100}).withMessage(`Maximum number of character is 100`)
        .isLength({min: 3}).withMessage("First name is required")
        .exists().withMessage('request is missing');

    check('lastname')
        .trim()
        .isLength({max: 100}).withMessage(`Maximum number of character is 100`)
        .isLength({min: 2}).withMessage("First name is required")
        .exists().withMessage('request is missing');

    check('email')
        .trim()
        .isLength({max : 100}).withMessage('maximum is 100 charecter')
        .isEmail().withMessage('enter a valid email')
        .isEmpty().withMessage('Email is required')
        .exists().withMessage('request is missing');

    check('username')
        .trim()
        .isLength({max: 100}).withMessage(`Maximum number of character is 100`)
        .isEmpty().withMessage('username is required')
        .exists().withMessage('requiest is missing');

    check('passsword')
        .trim()
        .isLength({min: 6}).withMessage("password must be at least 6 characters long")
        .exists().withMessage("Request is missing");

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }
}
