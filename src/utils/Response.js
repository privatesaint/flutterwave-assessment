export default (statusCode, data) => {
  const { field, field_value, condition, condition_value } = data;
  const message =
    statusCode === 200
      ? `field ${field} successfully validated.`
      : `field ${field} failed validation.`;
  const resp = {
    message,
    status: statusCode === 200 ? "success" : "error",
    data: {
      validation: {
        error: statusCode === 400,
        field,
        field_value,
        condition,
        condition_value,
      },
    },
  };
  return { statusCode, resp };
};
