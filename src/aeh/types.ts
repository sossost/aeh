export type Endpoint = string;
export type Method =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS"
  | "CONNECT"
  | "TRACE"
  | "ALL";
export type Status = string;
export type Code = string;
export type HandlerFunction = (error: BaseError) => void;

export type CodeHandlers = {
  [key in Code]?: HandlerFunction;
};

export type StatusHandlers = {
  [key in Status]?: HandlerFunction | CodeHandlers;
};

export type MethodHandlers = {
  [key in Method]?: HandlerFunction | StatusHandlers | CodeHandlers;
};

export type Handlers = {
  [endpoint: Endpoint]: {
    [key: string]: {
      [key: string]: {
        [key: string]: HandlerFunction;
      };
    };
  };
};

export type BaseError = {
  endpoint: Endpoint;
  method: Method;
  status: Status;
  code?: Code;
  msg?: string;
  handled?: boolean;
};

export type RegistryErrorHandler = {
  [key: Endpoint]:
    | MethodHandlers
    | StatusHandlers
    | CodeHandlers
    | HandlerFunction;
};

export type AddHandlerType = {
  endpoint: Endpoint;
  method: Method;
  status: Status;
  code: Code;
  handler: HandlerFunction;
};
