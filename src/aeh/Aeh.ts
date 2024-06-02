import {
  AddHandlerType,
  BaseError,
  Code,
  Endpoint,
  HandlerFunction,
  Handlers,
  Method,
  RegistryErrorHandler,
  Status,
} from "./types";

class Aeh {
  private handlers: Handlers = {};

  registryErrorHandler(errorObject: RegistryErrorHandler) {
    const processHandlers = (
      obj: RegistryErrorHandler,
      context: {
        endpoint?: Endpoint;
        method?: Method;
        status?: Status;
        code?: Code;
      } = {}
    ) => {
      Object.entries(obj).forEach(([key, value]) => {
        const nextContext = { ...context };
        if (!context.endpoint) {
          nextContext.endpoint = key as Endpoint;
        } else if (!context.method) {
          nextContext.method = key as Method;
        } else if (!context.status) {
          nextContext.status = key as Status;
        } else if (!context.code) {
          nextContext.code = key as Code;
        }

        if (typeof value === "function" && nextContext.endpoint) {
          this.addHandler({
            ...(nextContext as Omit<AddHandlerType, "handler">),
            handler: value as HandlerFunction,
          });
        } else {
          processHandlers(value as RegistryErrorHandler, nextContext);
        }
      });
    };

    processHandlers(errorObject);
  }

  clearRegistry() {
    this.handlers = {};
  }

  handle(error: BaseError) {
    const { endpoint, method, status, code } = error;
    const endpointKey = endpoint.replace(/^\//, "");

    const handler = this.findHandler(endpointKey, method, status, code);
    if (handler) {
      handler(error);
      error.handled = true;
    } else {
      this.unhandledError(error);
    }
  }

  private findHandler(
    endpoint: Endpoint,
    method?: Method,
    status?: Status,
    code?: Code
  ): HandlerFunction | null {
    if (!endpoint) return null;

    const endpointHandlers = this.handlers[endpoint];
    if (!endpointHandlers) return null;

    const methodKey = method ?? "all_methods";
    const statusKey = status ?? "all_statuses";
    const codeKey = code ?? "all_codes";

    const methodHandlers =
      endpointHandlers[methodKey] || endpointHandlers.all_methods;
    if (!methodHandlers) return null;

    const statusHandlers =
      methodHandlers[statusKey] || methodHandlers.all_statuses;
    if (!statusHandlers) return null;

    const codeHandlers = statusHandlers[codeKey] || statusHandlers.all_codes;
    if (!codeHandlers) return null;

    return typeof codeHandlers === "function" ? codeHandlers : null;
  }

  private addHandler({
    endpoint,
    method,
    status,
    handler,
    code,
  }: AddHandlerType) {
    const endpointKey = endpoint.replace(/^\//, "");

    if (!this.handlers[endpointKey]) {
      this.handlers[endpointKey] = {};
    }

    const methodKey = method || "all_methods";
    const statusKey = status || "all_statuses";
    const codeKey = code || "all_codes";

    if (!this.handlers[endpointKey][methodKey]) {
      this.handlers[endpointKey][methodKey] = {};
    }

    if (!this.handlers[endpointKey][methodKey][statusKey]) {
      this.handlers[endpointKey][methodKey][statusKey] = {};
    }

    this.handlers[endpointKey][methodKey][statusKey][codeKey] = handler;
  }

  private unhandledError(error: BaseError) {
    throw new Error(
      `Unhandled error: ${error.endpoint} ${error.method} ${error.status} ${error.code}`
    );
  }
}

export const aeh = new Aeh();
