import joi from "joi";

export const taskValidator = joi.object().keys({
  name: joi.string().required(),
  completed: joi.boolean(),
});

export const registerValidator = joi.object().keys({
  fullname: joi.string().required(),
  email: joi.string().required().email(),
  password: joi.string().min(6).max(15).required(),
});

export const loginValidator = joi.object().keys({
  email: joi.string().required(),
  password: joi.string().min(6).max(15).required(),
});

export const validationOptions = {
  abortEarly: false,
  errors: { wrap: { label: "" } },
};

export const googleSignOn = joi.object().keys({
  id: joi.string().required(),
  email: joi.string().email().required(),
  name: joi.string().required(),
});