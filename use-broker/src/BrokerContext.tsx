import React, { createContext, useEffect, useState } from "react";
import { Broker } from "./Broker";
import { AllowedTopics } from "./types";

export const BrokerContext = createContext<Broker<any> | undefined>(undefined);

type Props = {
    url: string;
    onOpen?: () => void;
    onClose?: () => void;
    children?: React.ReactNode;
};

export const BrokerProvider = <T extends AllowedTopics>({
    url,
    onOpen,
    onClose,
    children,
}: Props) => {
    const [webSocketBroker, setWebSocketBroker] = useState<Broker<T>>();

    useEffect(() => {
        setWebSocketBroker(new Broker<T>(url, onOpen, onClose));

        return () => {
            webSocketBroker?.close();
        };
    }, []);

    return (
        <BrokerContext.Provider value={webSocketBroker}>
            {children}
        </BrokerContext.Provider>
    );
};
