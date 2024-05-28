type Endpoint = string;
export type Method = "GET" | "POST" | "PUT" | "DELETE" | "ALL";
type Status = string;
type Code = string;
export type HandlerFunction = (error: BaseError) => void;
type StatusHandlers = {
  [code: Code]: HandlerFunction;
};
type MethodHandlers = {
  [status: Status]: StatusHandlers;
};
type EndpointHandlers = {
  [method: string]: MethodHandlers;
};
export type Handlers = {
  [endpoint: Endpoint]: EndpointHandlers;
};
export type BaseError = {
  endpoint: Endpoint;
  method: Method;
  status: number;
  code?: Code;
  msg?: string;
  handled?: boolean;
};
export type RegistryErrorHandler = {
  [key: Endpoint]:
    | HandlerFunction
    | {
        [key in Method]?:
          | HandlerFunction
          | {
              [key: Status]:
                | HandlerFunction
                | {
                    [key: Code]: HandlerFunction;
                  };
            };
      };
};

export type AddHandlerType = {
  endpoint: Endpoint;
  method?: Method;
  status?: Status;
  code?: Code;
  handler: HandlerFunction;
};
