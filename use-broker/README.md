# use-broker

Communication over WebSocket using topics!

## Usage

Using `use-broker` requires 3 steps:

1. Adding a context provider.
2. Defining the messages with a type.
3. Using the hook.

### Adding context

Each context provider creates a WebSocket that the children use with the `useBroker` hook.

```tsx
import { BrokerProvider } from "use-broker";

function App() {
    const url = "ws://localhost:5000";

    return (
        <BrokerProvider url={url}>
            <div>Hello</div>
        </BrokerProvider>
    );
}
```

### Defining the messages

Define a type where each key is a topic and each item is the request and response for that topic:

```typescript
export type UserBroker = {
    "user/data": {
        request: { id: string };
        response: { name: string; age: number; email: string };
    };
    "user/secrets": {
        request: { id: string };
        response: { password: string; CVV: number };
    };
};
```

### Use the hook

Then, use the `use-broker` hook with that type as a parameter to get type checking. The hook returns a function to send data through the WebSocket.

```tsx
import { useBroker } from "use-broker";
import { UserBroker } from "./myTypes"

function UserView = () => {
    const sender = useBroker<UserBroker>("user/data", (res)=>{
        // Handle response
    })
}
```

In the code above `res` has type `{ name: string; age: number; email: string }` and the parameter of `sender` has type `{ id: string }`, just like defined in `UserBroker`.
