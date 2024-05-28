import {
  AddHandlerType,
  BaseError,
  HandlerFunction,
  Handlers,
  Method,
  RegistryErrorHandler,
} from "./types";

class Restfeh {
  private handlers: Handlers = {};

  registryErrorHandler(errorObject: RegistryErrorHandler) {
    Object.entries(errorObject).forEach(
      ([endpoint, methodStatusHandlerCode]) => {
        if (typeof methodStatusHandlerCode === "function") {
          this.addHandler({
            endpoint,
            handler: methodStatusHandlerCode as HandlerFunction,
          });
        } else {
          Object.entries(methodStatusHandlerCode).forEach(
            ([method, statusHandlerCode]) => {
              if (typeof statusHandlerCode === "function") {
                this.addHandler({
                  endpoint,
                  method: method as Method,
                  handler: statusHandlerCode as HandlerFunction,
                });
              } else {
                Object.entries(statusHandlerCode).forEach(
                  ([status, handlerCode]) => {
                    if (typeof handlerCode === "function") {
                      this.addHandler({
                        endpoint,
                        method: method as Method,
                        status,
                        handler: handlerCode as HandlerFunction,
                      });
                    } else {
                      Object.entries(handlerCode).forEach(([code, handler]) => {
                        this.addHandler({
                          endpoint,
                          method: method as Method,
                          status,
                          code,
                          handler: handler as HandlerFunction,
                        });
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  }

  clearRegistry() {
    this.handlers = {};
  }

  handle(error: BaseError) {
    const { endpoint, method, status, code } = error;
    const endpointKey = endpoint.replace(/^\//, "");
    const methodKey = method ?? "ALL";
    const statusKey = status ? String(status) : "ALL";
    const codeKey = code ?? "ALL";

    const endpointHandlers =
      this.handlers[endpointKey] || this.handlers.default;
    if (!endpointHandlers) {
      this.unhandledError(error);
      return;
    }

    const methodHandlers = endpointHandlers[methodKey] || endpointHandlers.ALL;
    if (!methodHandlers) {
      this.unhandledError(error);
      return;
    }

    const statusHandlers = methodHandlers[statusKey] || methodHandlers.ALL;
    if (!statusHandlers) {
      this.unhandledError(error);
      return;
    }

    const handler = statusHandlers[codeKey];
    if (handler) {
      handler(error);
      error.handled = true;
    } else {
      this.unhandledError(error);
    }

    return;
  }

  private addHandler({
    endpoint,
    method,
    status,
    handler,
    code,
  }: AddHandlerType) {
    const endpointKey = endpoint.replace(/^\//, "");
    const methodKey = method ?? "ALL";
    const statusKey = status ?? "ALL";
    const codeKey = code ?? "ALL";

    if (!this.handlers[endpointKey]) {
      this.handlers[endpointKey] = {};
    }

    if (!this.handlers[endpointKey][methodKey]) {
      this.handlers[endpointKey][methodKey] = {};
    }

    if (!this.handlers[endpointKey][methodKey][statusKey]) {
      this.handlers[endpointKey][methodKey][statusKey] = {};
    }

    if (!this.handlers[endpointKey][methodKey][statusKey][codeKey]) {
      this.handlers[endpointKey][methodKey][statusKey][codeKey] = handler;
    }

    return this;
  }

  private unhandledError(error: BaseError) {
    console.error("Unhandled error:", error);
  }
}

export const restfeh = new Restfeh();
