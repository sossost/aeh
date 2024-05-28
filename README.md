# 목표

### 에러 핸들러 레지스트리 (Error Handler Registry):
다양한 엔드포인트와 상태 코드별로 에러 핸들러를 등록하고 관리

### 중앙 집중식 에러 핸들링 (Centralized Error Handling):
모든 네트워크 요청에서 발생하는 에러를 중앙에서 일관되게 처리

### 예시
```javascript
  const networkErrorHandlers = {
    "test-endpoint-1": {
      ALL:{
        401: () => navigateToLoginPage(),
      }
      GET:{
        404: (error) => handler(error),
        500: {
          code1: (error) => handler2(error)
          ...
        }
      }
      POST:{
        ...
      }
    },
    "test-endpoint-2": {
      ...
    },
  };

networkErrorHandler.registryErrorHandler(networkErrorHandlers)

networkErrorHandler.handle(error)
```
