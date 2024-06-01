import { resteh } from "./resteh";
import { RegistryErrorHandler } from "./types";

describe("NetworkErrorHandler", () => {
  beforeEach(() => {
    resteh.clearRegistry();
  });

  it("should correctly register handlers for multiple endpoints and methods", () => {
    const getHandler200 = jest.fn();
    const getHandler404 = jest.fn();
    const postHandler500 = jest.fn();
    const putHandler = jest.fn();

    const errorObject: RegistryErrorHandler = {
      "/test_endpoint": {
        GET: {
          "200": getHandler200,
          "404": getHandler404,
        },
        POST: {
          "500": postHandler500,
        },
      },
      "/another_endpoint": {
        PUT: {
          "201": putHandler,
        },
      },
    };

    resteh.registryErrorHandler(errorObject);

    const expectedHandlers = {
      test_endpoint: {
        GET: {
          "200": {
            all_codes: getHandler200,
          },
          "404": {
            all_codes: getHandler404,
          },
        },
        POST: {
          "500": {
            all_codes: postHandler500,
          },
        },
      },
      another_endpoint: {
        PUT: {
          "201": {
            all_codes: putHandler,
          },
        },
      },
    };

    expect(resteh["handlers"]).toEqual(expectedHandlers);
  });

  it("should handle errors for multiple endpoints correctly by calling the appropriate handler", () => {
    const getHandler200 = jest.fn();
    const postHandler500 = jest.fn();
    const putHandler201 = jest.fn();

    resteh.registryErrorHandler({
      "/test_endpoint": {
        GET: {
          "200": getHandler200,
        },
        POST: {
          "500": postHandler500,
        },
      },
      "/another_endpoint": {
        PUT: {
          "201": putHandler201,
        },
      },
    });

    // /test_endpoint GET 200 요청 처리
    resteh.handle({
      endpoint: "/test_endpoint",
      method: "GET",
      status: "200",
      code: "",
      handled: false,
    });
    expect(getHandler200).toHaveBeenCalled();

    // /test_endpoint POST 500 요청 처리
    resteh.handle({
      endpoint: "/test_endpoint",
      method: "POST",
      status: "500",
      code: "",
      handled: false,
    });
    expect(postHandler500).toHaveBeenCalled();

    // /another_endpoint PUT 201 요청 처리
    resteh.handle({
      endpoint: "/another_endpoint",
      method: "PUT",
      status: "201",
      code: "",
      handled: false,
    });
    expect(putHandler201).toHaveBeenCalled();
  });

  it("should ", () => {
    const handler = jest.fn();

    resteh.registryErrorHandler({
      "/test_endpoint": handler,
    });

    resteh.handle({
      endpoint: "/test_endpoint",
      method: "GET",
      status: "404",
      handled: false,
    });

    expect(handler).toHaveBeenCalled();
  });
});
