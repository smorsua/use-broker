import { AllowedTopics, Request, Response, Topic } from "./types";
import { BrokerContext } from "./BrokerContext";
import { useContext, useEffect, useCallback } from "react";

export function useBroker<AT extends AllowedTopics>(
    topic: Topic<AT>,
    callback?: (msg: Response<AT[typeof topic]>) => void
): (msg: Request<AT[typeof topic]>) => void {
    const broker = useContext(BrokerContext);

    useEffect(() => {
        if (callback) {
            broker?.addCallback(topic, callback);
        }

        return () => {
            if (callback) {
                broker?.removeCallback(topic, callback);
            }
        };
    }, [topic, callback, broker]);

    const sender = useCallback(broker ? broker.createSender(topic) : () => {}, [
        broker,
    ]);

    return sender;
}
