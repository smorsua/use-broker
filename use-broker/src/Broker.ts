import { AllowedTopics, Request, Response, Topic } from "./types";

export class Broker<AT extends AllowedTopics> {
    private webSocket: WebSocket;
    private topicToCallbacks: Map<string, Array<Callback>> = new Map();

    constructor(url: string, onOpen?: () => void, onClose?: () => void) {
        this.webSocket = new WebSocket(url);

        this.webSocket.onmessage = (ev: MessageEvent<string>) => {
            const socketMessage = JSON.parse(ev.data) as any;
            const callbacks =
                this.topicToCallbacks.get(socketMessage.topic) ?? [];
            for (const callback of callbacks) {
                callback(socketMessage.payload);
            }
        };

        if (onOpen) {
            this.webSocket.onopen = onOpen;
        }

        if (onClose) {
            this.webSocket.onclose = onClose;
        }
    }

    public addCallback(topic: Topic<AT>, callback: Callback) {
        const callbacks = this.topicToCallbacks.get(topic) ?? [];
        this.topicToCallbacks.set(topic, [...callbacks, callback]);
    }

    public removeCallback(topic: Topic<AT>, handler: Callback) {
        if (!this.topicToCallbacks.has(topic)) {
            console.warn(`Path ${topic} doesn't exist in pathToHandlers`);
        } else {
            const callbacks = this.topicToCallbacks.get(topic)!;
            this.topicToCallbacks.set(
                topic,
                callbacks.filter((element) => element != handler)
            );

            if (this.topicToCallbacks.get(topic)?.length == 0) {
                this.topicToCallbacks.delete(topic);
            }
        }
    }

    public createSender(topic: Topic<AT>) {
        return (msg: Request<AT[typeof topic]>) => {
            this.webSocket.send(JSON.stringify({ topic, msg }));
        };
    }

    public close() {
        this.webSocket.close();
    }
}

export type Callback = (msg: unknown) => void;

export type Message<T> = {
    topic: string;
    payload: T;
};
