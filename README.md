# 목표

### 에러 핸들러 레지스트리 (Error Handler Registry):
다양한 엔드포인트와 상태 코드별로 에러 핸들러를 등록하고 관리

### 중앙 집중식 에러 핸들링 (Centralized Error Handling):
모든 네트워크 요청에서 발생하는 에러를 중앙에서 일관되게 처리

### 예시
```javascript
  const networkErrorHandlers = {
    "test-endpoint-1": {
      401: (error) => handler1(error),
      403: {
        "invalid-token": (error) => handler2(error),
        "expired-token": (error) => handler3(error),
      },
      404: (error) => handler4(error),
      500: (error) => handler5(error),
    },
    "test-endpoint-2": {
      401: (error) => handler1(error),
      403: {
        "invalid-token": (error) => handler2(error),
        "expired-token": (error) => handler3(error),
      },
      404: (error) => handler4(error),
      500: (error) => handler5(error),
    },
  };

networkErrorHandler.registryErrorHandler(networkErrorHandlers)

networkErrorHandler.handle(error)
```
