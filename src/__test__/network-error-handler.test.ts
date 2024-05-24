import { networkErrorHandler } from "../network-error-handler";
import { BaseError, RegistryErrorHandler } from "../types";

type NetworkErrorHandlerType = typeof networkErrorHandler;

describe("NetworkErrorHandler", () => {
  const mockErrorHandler = jest.fn();

  const networkErrorHandlers: RegistryErrorHandler = {
    "test-endpoint-1": {
      401: (error) => mockErrorHandler(error),
      403: {
        "invalid-token": (error) => mockErrorHandler(error),
        "expired-token": (error) => mockErrorHandler(error),
      },
      404: (error) => mockErrorHandler(error),
      500: (error) => mockErrorHandler(error),
    },
    "test-endpoint-2": {
      401: (error) => mockErrorHandler(error),
      403: {
        "invalid-token": (error) => mockErrorHandler(error),
        "expired-token": (error) => mockErrorHandler(error),
      },
      404: (error) => mockErrorHandler(error),
      500: (error) => mockErrorHandler(error),
    },
  };

  const errors: BaseError[] = [
    {
      endpoint: "test-endpoint-1",
      status: 401,
    },
    {
      endpoint: "test-endpoint-1",
      status: 403,
      code: "invalid-token",
    },
    {
      endpoint: "test-endpoint-1",
      status: 403,
      code: "expired-token",
    },
    {
      endpoint: "test-endpoint-1",
      status: 404,
    },
    {
      endpoint: "test-endpoint-1",
      status: 500,
    },
    {
      endpoint: "test-endpoint-2",
      status: 401,
    },
    {
      endpoint: "test-endpoint-2",
      status: 403,
      code: "invalid-token",
    },
    {
      endpoint: "test-endpoint-2",
      status: 403,
      code: "expired-token",
    },
    {
      endpoint: "test-endpoint-2",
      status: 404,
    },
    {
      endpoint: "test-endpoint-2",
      status: 500,
    },
  ];

  networkErrorHandler.registryErrorHandler(networkErrorHandlers);

  test.each(errors)('should handler error for endpoint "%s"', (error) => {
    networkErrorHandler.handle(error);
    expect(mockErrorHandler).toHaveBeenCalledWith(error);
  });

  it("should call unhandledError for an unknown endpoint", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const unknownEndpointError: BaseError = {
      endpoint: "unknown-endpoint",
      status: 404,
    };

    networkErrorHandler.handle(unknownEndpointError);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Unhandled error:",
      unknownEndpointError
    );

    consoleSpy.mockRestore();
  });
});
