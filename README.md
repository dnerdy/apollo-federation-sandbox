# Apollo Federation Sandbox

Code for experimenting with Apollo federation.

To install the dependencies run `npm install`.

To run the services run `./run.sh`.

## Overview

The federated services `service-a.js` and `service-b.js` are started before the
gateway `gateway.js`, and all services are killed when stopping the runner.

Each service logs its URL to the console, and an apollo-service GraphQL
playground is available at each URL.

To start querying, visit: http://localhost:4000/

The first query you'll see for each service is the SDL query from the gateway:

```
service-b: Operation:
service-b:     Query:     query GetServiceDefinition { _service { sdl } }
service-b:     Variables: undefined
service-a: Operation:
service-a:     Query:     query GetServiceDefinition { _service { sdl } }
service-a:     Variables: undefined
```

As you perform your own queries in the playground(s), you can track the queries
across services.

## Here are some queries to try

### Get all users
```
query {
  users {
    name
  }
}
```

### Get all users along with their pet
```
query {
  users {
    name
    pet {
      name
    }
  }
}
```

### A deeply nested query
```
query {
  users {
    name
    pet {
      name
      owner {
        name
        friends {
          name
        }
      }
    }
  }
}
```

### Federated interfaces
```
query {
  users {
    name
    place {
      name
    }
    pet {
      place {
        name
      }
    }
  }
}
```
