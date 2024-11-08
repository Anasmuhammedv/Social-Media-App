import Joi from 'joi';


export const userCreateBody = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    "string.base": "Name should be a type of text",
    "string.empty": "Name is required",
    "string.min": "Name should have a minimum length of {#limit}",
    "string.max": "Name should have a maximum length of {#limit}",
    "any.required": "Name is required"
  }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .messages({
      "string.base": "Email should be a type of text",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required"
    }),

  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .messages({
      'string.base': 'Password should be a string',
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password should be at least 8 characters long',
      'string.max': 'Password should not exceed 30 characters',
      'string.pattern.base': 'Password should contain only alphanumeric characters',
      'any.required': 'Password is required'
    }),

  // token: Joi.string().optional()
  userId: Joi.string().optional()
});





//update institute joi
    
export const instituteUpdateBody = Joi.object({
   name: Joi.string().min(3).max(30).required().messages({
        "string.base": "Name should be a type of text",
        "string.empty": "Name is required",
        "string.min": "Name should have a minimum length of {#limit}",
        "string.max": "Name should have a maximum length of {#limit}",
        "any.required": "Name is required"
      }),


  phone: Joi.string()
      .pattern(new RegExp("^((\\+91)|(91))?[6-9]\\d{9}$"))
      .messages({
        "string.base": "Phone number should be a type of text",
        "string.empty": "Phone number is required",
        "any.required": "Phone number is required",
        "string.pattern.base": "Enter a valid phone number with country code"
      }),

    
   email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .messages({
      "string.base": "Email should be a type of text",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required"
    })

    })