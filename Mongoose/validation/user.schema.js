const Joi = require('joi');

module.exports.local_signup_post= Joi.object({
	fullName: Joi.string().required(),
	userName: Joi.string()
		.pattern(/^(?!\d+$)[a-z0-9_-]{3,30}$/)
		.required()
		.messages({
			'string.pattern.base':
				'Username must contain lowercase letters and can include numbers, underscores, or hyphens, but cannot consist of only numbers. It must be 3-30 characters long.',
		}),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

module.exports.local_login_post = Joi.object({
	identifier: Joi.string().required().messages({
		'string.base': 'Email or username is required.',
		'string.empty': 'Email or username cannot be empty.',
	}),
	password: Joi.string().required().messages({
		'string.base': 'Password is required.',
		'string.empty': 'Password cannot be empty.',
	}),
});

module.exports.forgot_password_post = Joi.object({
	email: Joi.string().email().required(),
});

module.exports.reset_password_post = Joi.object({
	email: Joi.string().email().required(),
	forgotPasswordCode: Joi.string().required(),
	newPassword: Joi.string().min(6).required(),
});

module.exports.change_password_post = Joi.object({
	currentPassword: Joi.string().required(),
	newPassword: Joi.string().min(6).required(),
});
