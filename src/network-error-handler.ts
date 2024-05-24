import {
  AddHandlerType,
  BaseError,
  Handlers,
  RegistryErrorHandler,
} from "./types";

class NetworkErrorHandler {
  private handlers: Handlers = {};

  registryErrorHandler(errorObject: RegistryErrorHandler) {
    Object.entries(errorObject).forEach(([endpoint, statusHandlerCode]) => {
      Object.entries(statusHandlerCode).forEach(([status, handlerCode]) => {
        if (typeof handlerCode === "function") {
          this.addHandler({
            endpoint,
            status: parseInt(status, 10),
            handler: handlerCode,
          });
          return;
        }

        Object.entries(handlerCode).forEach(([code, handler]) => {
          this.addHandler({
            endpoint,
            status: parseInt(status, 10),
            code,
            handler,
          });
        });
      });
    });
  }

  handle(error: BaseError) {
    const { endpoint, status, code } = error;
    const endpointKey = endpoint.replace(/^\//, "");
    const statusKey = status ?? 0;
    const codeKey = code ?? "default";

    const endpointHandlers = this.handlers[endpointKey];
    if (!endpointHandlers) {
      this.unhandledError(error);
      return;
    }

    const statusHandlers = endpointHandlers[statusKey];
    if (!statusHandlers) {
      this.unhandledError(error);
      return;
    }

    const handler = statusHandlers[codeKey];
    if (handler) {
      handler(error);
    } else {
      this.unhandledError(error);
    }

    return;
  }

  private addHandler({ endpoint, status, handler, code }: AddHandlerType) {
    const endpointKey = endpoint.replace(/^\//, "");
    const statusKey = status ?? 0;
    const codeKey = code ?? "default";

    if (!this.handlers[endpointKey]) {
      this.handlers[endpointKey] = {};
    }

    if (!this.handlers[endpointKey][statusKey]) {
      this.handlers[endpointKey][statusKey] = {};
    }

    if (!this.handlers[endpointKey][statusKey][codeKey]) {
      this.handlers[endpointKey][statusKey][codeKey] = handler;
    }

    return this;
  }

  private unhandledError(error: BaseError) {
    console.error("Unhandled error:", error);
  }
}

export const networkErrorHandler = new NetworkErrorHandler();
