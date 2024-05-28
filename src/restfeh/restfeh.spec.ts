import { restfeh } from "./restfeh";
import { BaseError, HandlerFunction, RegistryErrorHandler } from "./types";

describe("Restfeh", () => {
  beforeEach(() => {
    restfeh.clearRegistry();
  });

  it("should register and handle an error with specific method, status, and code", () => {
    const mockHandler: HandlerFunction = jest.fn();

    const errorHandlers: RegistryErrorHandler = {
      "/test-endpoint": {
        GET: {
          404: {
            NOT_FOUND: mockHandler,
          },
        },
      },
    };

    restfeh.registryErrorHandler(errorHandlers);

    const error: BaseError = {
      endpoint: "/test-endpoint",
      method: "GET",
      status: 404,
      code: "NOT_FOUND",
      msg: "Resource not found",
      handled: false,
    };

    restfeh.handle(error);

    expect(mockHandler).toHaveBeenCalledWith(error);
    expect(error.handled).toBe(true);
  });

  it("should register and handle an error with default code handler", () => {
    const mockHandler: HandlerFunction = jest.fn();

    const errorHandlers: RegistryErrorHandler = {
      "/test-endpoint": {
        GET: {
          500: mockHandler,
        },
      },
    };

    restfeh.registryErrorHandler(errorHandlers);

    const error: BaseError = {
      endpoint: "/test-endpoint",
      method: "GET",
      status: 500,
      msg: "Internal server error",
      handled: false,
    };

    restfeh.handle(error);

    expect(mockHandler).toHaveBeenCalledWith(error);
    expect(error.handled).toBe(true);
  });

  it("should register and handle an error with default method and status handler", () => {
    const mockHandler: HandlerFunction = jest.fn();

    const errorHandlers: RegistryErrorHandler = {
      "/test-endpoint": {
        GET: mockHandler,
      },
    };

    restfeh.registryErrorHandler(errorHandlers);

    const error: BaseError = {
      endpoint: "/test-endpoint",
      method: "GET",
      status: 403,
      msg: "Forbidden",
      handled: false,
    };

    restfeh.handle(error);

    expect(mockHandler).toHaveBeenCalledWith(error);
    expect(error.handled).toBe(true);
  });

  it("should register and handle an error with default endpoint handler", () => {
    const mockHandler: HandlerFunction = jest.fn();

    const errorHandlers: RegistryErrorHandler = {
      default: mockHandler,
    };

    restfeh.registryErrorHandler(errorHandlers);

    const error: BaseError = {
      endpoint: "/unknown-endpoint",
      method: "PUT",
      status: 401,
      msg: "Unauthorized",
      handled: false,
    };

    restfeh.handle(error);

    expect(mockHandler).toHaveBeenCalledWith(error);
    expect(error.handled).toBe(true);
  });

  it("should not handle an unregistered error", () => {
    const mockHandler: HandlerFunction = jest.fn();

    const errorHandlers: RegistryErrorHandler = {
      "/test-endpoint": {
        GET: {
          200: mockHandler,
        },
      },
    };

    restfeh.registryErrorHandler(errorHandlers);

    const error: BaseError = {
      endpoint: "/test-endpoint",
      method: "GET",
      status: 404,
      msg: "Not Found",
      handled: false,
    };

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    restfeh.handle(error);

    expect(mockHandler).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Unhandled error:", error);
    expect(error.handled).toBe(false);

    consoleSpy.mockRestore();
  });
});
