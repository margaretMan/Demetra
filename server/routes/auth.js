const express = require('express');
const validator = require('validator');
const passport = require('passport');
const Owner = require('mongoose').model('Owner');

const router = new express.Router();

function validateSignUpForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
        isFormValid = false;
        errors.name = 'Please provide your name.';
    }

    if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Please provide a correct email address.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
        isFormValid = false;
        errors.password = 'Password must have at least 8 characters.';
    }

    // if (!payload || typeof payload.phone !== 'string' || payload.phone.trim().length === 0) {
    //     isFormValid = false;
    //     errors.phone = 'Please provide your phone number.';
    // }
    //
    // if (!payload || typeof payload.country !== 'string' || payload.country.trim().length === 0) {
    //     isFormValid = false;
    //     errors.country = 'Please provide your country.';
    // }
    //
    // if (!payload || typeof payload.city !== 'string' || payload.city.trim().length === 0) {
    //     isFormValid = false;
    //     errors.city = 'Please provide your city.';
    // }
    //
    // if (!payload || typeof payload.street !== 'string' || payload.street.trim().length === 0) {
    //     isFormValid = false;
    //     errors.street = 'Please provide your house number.';
    // }
    //
    // if (!payload || typeof payload.house !== 'string' || payload.house.trim().length === 0) {
    //     isFormValid = false;
    //     errors.house = 'Please provide your house number.';
    // }
    //
    // if (!payload || typeof payload.flat !== 'string' || payload.flat.trim().length === 0) {
    //     isFormValid = false;
    //     errors.flat = 'Please provide your flat number.';
    // }

    if (!isFormValid) {
        message = 'Check the form for errors.';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

function validateLoginForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
        isFormValid = false;
        errors.email = 'Please provide your email address.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
        isFormValid = false;
        errors.password = 'Please provide your password.';
    }

    if (!isFormValid) {
        message = 'Check the form for errors.';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

function validateLoginEmployeeForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
        isFormValid = false;
        errors.userId = 'Please provide your id.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
        isFormValid = false;
        errors.password = 'Please provide your password.';
    }

    if (!isFormValid) {
        message = 'Check the form for errors.';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

router.post('/signup', (req, res, next) => {
    const validationResult = validateSignUpForm(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }


    return passport.authenticate('local-signup', (err) => {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                // the 11000 Mongo code is for a duplication email error
                // the 409 HTTP status code is for conflict error

                return res.status(409).json({
                    success: false,
                    message: 'Check the form for errors.',
                    errors: {
                        email: 'This email is already taken.'
                    }
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Could not process the form.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'You have successfully signed up! Now you should be able to log in.'
        });
    })(req, res, next);
});

router.post('/login', (req, res, next) => {
    const validationResult = validateLoginForm(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    return passport.authenticate('local-login', (err, token, userData) => {
        if (err) {
            if (err.name === 'IncorrectCredentialsError') {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Could not process the form.'
            });
        }

        return res.json({
            success: true,
            message: 'You have successfully logged in!',
            token,
            user: userData
        });
    })(req, res, next);
});

router.post('/loginEmployee', (req, res, next) => {
    const id = req.body.email;
    const validationResult = validateLoginEmployeeForm(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }
    Owner.findOne({userId: id}, (err, user) => {
       if(err){
           return res.json({
               success: false,
               message: 'Incorrect id or password'
           });
       }
        return res.json({
            success: true,
            message: 'You have successfully logged in!',
            userId: user.userId
        });
    });
    // return passport.authenticate('local-loginEmployee', (err, token, userData) => {
    //     if (err) {
    //         if (err.name === 'IncorrectCredentialsError') {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: err.message
    //             });
    //         }
    //
    //         return res.status(400).json({
    //             success: false,
    //             message: 'Could not process the form.'
    //         });
    //     }
    //     return res.json({
    //         success: true,
    //         message: 'You have successfully logged in!',
    //         userId: userData.userId
    //     });
    // })(req, res, next);
});


module.exports = router;