import Joi from 'joi';

export const createTransactionSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .max(999999999.99)
    .precision(2)
    .required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be a positive number',
      'number.max': 'Amount cannot exceed 999,999,999.99',
      'any.required': 'Amount is required',
    }),
  source: Joi.string()
    .trim()
    .max(255)
    .required()
    .messages({
      'string.empty': 'Source is required',
      'string.max': 'Source cannot exceed 255 characters',
      'any.required': 'Source is required',
    }),
  categoryId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Invalid category ID',
      'any.required': 'Category is required',
    }),
  transactionDate: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.base': 'Invalid date format',
      'date.max': 'Date cannot be in the future',
      'any.required': 'Transaction date is required',
    }),
  notes: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Notes cannot exceed 1000 characters',
    }),
});

export const updateTransactionSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .max(999999999.99)
    .precision(2)
    .optional()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be a positive number',
      'number.max': 'Amount cannot exceed 999,999,999.99',
    }),
  source: Joi.string()
    .trim()
    .max(255)
    .optional()
    .messages({
      'string.max': 'Source cannot exceed 255 characters',
    }),
  categoryId: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.guid': 'Invalid category ID',
    }),
  transactionDate: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.base': 'Invalid date format',
      'date.max': 'Date cannot be in the future',
    }),
  notes: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Notes cannot exceed 1000 characters',
    }),
});
