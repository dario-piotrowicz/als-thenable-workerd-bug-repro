# AsyncLocalStorage Workerd Bug Reproduction

It seems like the AsyncContext of an `AsyncLocalStorage` gets lost inside custom thenables.

By running the worker in this repository (`npm i` + `npm run dev`) and hitting the worker you can
see the following result:
```
hello undefined (👈 this should be "hello world!")
```

with the following logs:
```
- (in myAls.run) myAls.getStore() is an object
- (in new Promise) myAls.getStore() is an object
- (in new Promise.then) myAls.getStore() is an object
- (before returning) myAls.getStore() is an object
- (in helloWorldThenable.then) myAls.getStore() is an undefined
```

showcasing that `myAls.getStore()` wrongly returns `undefined` when run inside a custom thenable's `then` method (as you can see, surprisingly it does work inside a standard Promise's `then` method)