import catchAsyncError from "../middleware/catchAsyncError";
import ValidatorService from "../services/Validator";

export const index = catchAsyncError(async(req, res) => {
    const data = {
        name: "Gbenga Joshua Olowogbayi",
        github: "@privatesaint",
        email: "olowogbayigbenga@gmail.com",
        mobile: "08138623302",
        twitter: "@i_amgbayi",
    };

    return res.status(200).json({
        message: "My Rule-Validation API",
        status: "success",
        data,
    });
});

export const validator = catchAsyncError(async(req, res) => {
    const { statusCode, resp } = await ValidatorService.validator(req.body);

    return res.status(statusCode).json(resp);
});