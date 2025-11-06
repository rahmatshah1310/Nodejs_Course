const Joi = require("joi");

module.exports.updateSettings = Joi.object({
  userName: Joi.string()
    .pattern(/^(?!\d+$)[a-z0-9_-]{3,30}$/)
    .messages({
      "string.pattern.base":
        "Username must contain lowercase letters and can include numbers, underscores, or hyphens, but cannot consist of only numbers. It must be 3-30 characters long.",
    }),
  fullName: Joi.string().max(100).messages({
    "string.max": "Full name cannot exceed 100 characters.",
  }),
  websiteUrl: Joi.string().uri().allow(null).messages({
    "string.uri": "Website URL must be a valid URL.",
  }),
  gender: Joi.string().valid("Male", "Female").allow(null).messages({
    "any.only": "Gender must be either 'Male' or 'Female'.",
  }),
  bio: Joi.string().max(200).messages({
    "string.max": "Bio cannot exceed 200 characters.",
  }),
  isPublic: Joi.boolean().messages({
    "boolean.base": "'isPublic' must be a boolean value (true or false).",
  }),
});
