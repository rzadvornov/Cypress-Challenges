export function Singleton<T extends new (...args: any[]) => any>(target: T): T {
  let instance: InstanceType<T> | undefined;
  
  const proxy = new Proxy(target, {
    construct(target, args): InstanceType<T> {
      if (!instance) {
        instance = Reflect.construct(target, args) as InstanceType<T>;
      }
      return instance!;
    }
  });
  
  return proxy as T;
}
