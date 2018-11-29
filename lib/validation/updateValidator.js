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
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }
}

