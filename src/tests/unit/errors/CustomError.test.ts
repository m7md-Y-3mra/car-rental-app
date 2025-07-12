import CustomError from "@/errors/CustomError";

describe("CustomError", () => {
  it("should create error with all properties", () => {
    const error = new CustomError({
      message: "Test error",
      statusCode: 400,
      code: "ERR_TEST",
    });

    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("ERR_TEST");
  });

  it("should create error without code", () => {
    const error = new CustomError({
      message: "Test error",
      statusCode: 400,
    });

    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(400);
    expect(error.code).toBeUndefined();
  });
});
