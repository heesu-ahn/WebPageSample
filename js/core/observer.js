export class Observer {
  constructor() {
    this._observers = new Set();
    this.config = { attributes: true, childList: true, subtree: true };
  }
  subscribe(observer) {
    this._observers.add(observer);
  }
  notify() {
    this._observers.forEach((observer) => observer());
  }
  callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        console.log("A child node has been added or removed.");
      } else if (mutation.type === "attributes") {
        console.log(`The ${mutation.attributeName} attribute was modified.`);
      }
    }
  };
}