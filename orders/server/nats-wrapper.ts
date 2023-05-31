import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  // this turns into a property and not in a method
  get client() {
    if (!this._client)
      throw new Error("Cannon access NATS client before connecting");

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        return resolve();
      });

      this.client.on("error", (err) => {
        return reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
