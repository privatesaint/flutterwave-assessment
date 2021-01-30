import ErrorHandler from "../utils/ErrorHandler";
import formatResponse from "../utils/Response";

class ValidatorService {
  /**
   * @description Request validator
   * @param {*} data
   */
  static async validator({ rule, data }) {
    if (
      typeof data !== "string" &&
      !Array.isArray(data) &&
      typeof data !== "object"
    ) {
      throw new ErrorHandler("data should be either string|array|object.", 400);
    }
    const { field } = rule;
    // nested object
    if (field.includes(".")) {
      return await this.nestedObjectValidator(rule, data);
    }

    return this.objectValidator(rule, data);
  }

  /**
   * @description Handles nested object validation
   * @param {*} rule
   * @param {*} data
   */
  static async nestedObjectValidator(rule, data) {
    const { field, condition, condition_value } = rule;
    const levels = field.split(".");
    const copyRule = { ...rule };

    if (levels.length > 2) {
      throw new ErrorHandler("Invalid JSON payload passed.", 400);
    }
    if (!data[levels[0]]) {
      throw new ErrorHandler(`field ${levels[0]} is missing from data.`, 400);
    }
    if (!data[levels[0]][levels[1]]) {
      throw new ErrorHandler(`field ${field} is missing from data.`, 400);
    }
    this.dataTypeValidator(field, condition, data[levels[0]][levels[1]]);

    copyRule.field_value = data[levels[0]][levels[1]];

    if (condition === "eq") {
      if (data[levels[0]][levels[1]] == condition_value) {
        return formatResponse(200, copyRule);
      }
    }
    if (condition === "neq") {
      if (data[levels[0]][levels[1]] != condition_value) {
        return formatResponse(200, copyRule);
      }
    }
    if (condition === "gt") {
      if (data[levels[0]][levels[1]] > condition_value) {
        return formatResponse(200, copyRule);
      }
    }
    if (condition === "gte") {
      if (data[levels[0]][levels[1]] >= condition_value) {
        return formatResponse(200, copyRule);
      }
    }
    if (condition === "contains") {
      if (data[levels[0]][levels[1]].includes(condition_value)) {
        return formatResponse(200, copyRule);
      }
    }
    return formatResponse(400, copyRule);
  }

  /**
   * @description Handles object validation
   * @param {*} rule
   * @param {*} data
   */
  static async objectValidator(rule, data) {
    const { field, condition, condition_value } = rule;
    const copyRule = { ...rule };

    if (!data[field]) {
      throw new ErrorHandler(`field ${field} is missing from data.`, 400);
    }

    this.dataTypeValidator(field, condition, data[field]);

    copyRule.field_value = data[field];
    if (condition === "eq") {
      if (data[field] == condition_value) {
        return formatResponse(200, copyRule);
      }
    }
    if (condition === "neq") {
      if (data[field] != condition_value) {
        return formatResponse(200, copyRule);
      }
    }
    if (condition === "gt") {
      if (data[field] > condition_value) {
        return formatResponse(200, copyRule);
      }
    }
    if (condition === "gte") {
      if (data[field] >= condition_value) {
        return formatResponse(200, copyRule);
      }
    }
    if (condition === "contains") {
      if (data[field].includes(condition_value)) {
        return formatResponse(200, copyRule);
      }
    }
    return formatResponse(400, copyRule);
  }

  /**
   * @description Handles data type validation
   * @param {*} field
   * @param {*} condition
   * @param {*} data
   */
  static dataTypeValidator(field, condition, data) {
    if (condition === "contains" && !Array.isArray(data)) {
      throw new ErrorHandler(`${field} should be an array.`, 400);
    }

    if (
      (condition === "eq" || condition === "neq") &&
      typeof data == "object"
    ) {
      throw new ErrorHandler(`${field} should be a string.`, 400);
    }

    if (
      (condition === "gt" || condition === "gte") &&
      typeof data !== "number"
    ) {
      throw new ErrorHandler(`${field} should be a number.`, 400);
    }
  }
}

export default ValidatorService;
