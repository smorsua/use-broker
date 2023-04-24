type TopicEntry<Req = unknown, Res = unknown> = {
    request?: Req;
    response?: Res;
};

export type AllowedTopics = Record<string, TopicEntry>;

export type Topic<T> = keyof T & string;

export type Request<T extends TopicEntry> = T["request"];

export type Response<T extends TopicEntry> = T["request"];
