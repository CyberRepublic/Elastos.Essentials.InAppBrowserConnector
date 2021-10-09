

class EssentialsBridge {
  private callbacks = new Map<number, {
    resolve: Function,
    reject: Function
  }>();

  constructor() { }

  /**
   * Internal js -> native message handler.
   *
   * Returns a promise that is resolved when the native code (essentials) sends the command
   * response.
   */
  public postMessage<T>(handler: string, data: unknown): Promise<T> {
    let id = Date.now() + Math.floor(Math.random() * 100000);
    console.log("EssentialsBridge: postMessage", handler, id, data);

    return new Promise<T>((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });

      let object = {
        id: id,
        name: handler,
        object: data,
      };
      (window as any).webkit.messageHandlers.essentialsExtractor.postMessage(JSON.stringify(object));
    });
  }

  /**
   * Internal native result -> js
   */
  public sendResponse<T>(id: number, result: T): void {
    console.log("EssentialsBridge: sendResponse", id, result);

    this.callbacks.get(id).resolve(result);
  }

  /**
  * Internal native error -> js
  */
  public sendError(id: number, error: string) {
    console.log("EssentialsBridge: sendError", id, error);

    let callback = this.callbacks.get(id);
    if (callback) {
      this.callbacks.get(id).reject(error);
      this.callbacks.delete(id);
    }
  }
}

export const essentialsBridge = new EssentialsBridge();