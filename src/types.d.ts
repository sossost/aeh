type Endpoint = string;
type Status = number;
type Code = string;
type HandlerFunction = (error: BaseError) => void;
type StatusHandlers = {
  [code: string]: HandlerFunction;
};
type EndpointHandlers = {
  [status: number]: StatusHandlers;
};
export type Handlers = {
  [endpoint: Endpoint]: EndpointHandlers;
};
export type BaseError = {
  endpoint: string;
  status?: Status;
  code?: Code;
  msg?: string;
  method?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timestamp?: string;
  retryCount?: number;
  additionalData?: Record<string, any>;
};
export type RegistryErrorHandler = {
  [key: Endpoint]: {
    [key: Status]:
      | HandlerFunction
      | {
          [key: Code]: HandlerFunction;
        };
  };
};

export type AddHandlerType = {
  endpoint: string;
  status?: number;
  code?: string;
  handler: HandlerFunction;
};
