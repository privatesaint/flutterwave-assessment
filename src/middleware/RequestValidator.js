import Joi from "@hapi/joi";
import catchAsyncError from "../middleware/catchAsyncError";

export default catchAsyncError(async(req, res, next) => {
    const data = req.body;
    const requestSchema = Joi.object({
            rule: Joi.object({
                    field: Joi.string().trim().required().messages({
                        "string.base": "field is required.",
                        "string.empty": "field is required.",
                        "any.required": "field is required.",
                    }),
                    condition: Joi.string()
                        .valid("eq", "neq", "gt", "gte", "contains")
                        .required()
                        .messages({
                            "string.base": "condition is required.",
                            "string.empty": "condition is required.",
                            "any.only": "rule should be either eq|neq|gt|gte|contains.",
                            "any.required": "condition is required.",
                        }),
                    condition_value: Joi.any().required().messages({
                        "string.base": "condition_value is required.",
                        "string.empty": "condition_value is required.",
                        "any.required": "condition_value is required.",
                    }),
                })
                .required()
                .messages({
                    "object.base": "rule should be an object.",
                    "any.required": "rule is required.",
                }),
            data: Joi.any().required().messages({
                "any.required": "data is required",
            }),
        })
        .unknown()
        .messages({
            "object.unknown": "Invalid JSON payload passed.",
        });

    const validatedData = await requestSchema.validateAsync(data);

    if (validatedData) {
        next();
    }
});