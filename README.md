# Express Utilities
Express Utils provides a set of middleware and utilities to streamline ExpressJS development.

### Features

1. Response Structure Middleware (`responseStructureMiddleware`)
    - Adds a unique requestId to each request.
    - Provides a structured response format (res.respond(statusCode, data)).
    - Automatically determines success based on status code.

2. Error Handling Middleware (`errorController`)
    - Standardized error responses with detailed debugging.
    - Uses res.respond() if available, otherwise falls back to res.status().json().
    - Hides stack traces in production.

3. 404 Not Found Handler (`notFoundController`)
    - Automatically returns a 404 Not Found response when no route matches.

### Installation

1. Add the following to your `.npmrc` file:
```npmrc
@zacaustin:registry=https://npm.pkg.github.com
```
2. Install using the following command:
```bash
npm install --save @zacaustin/express-utils
```

### Usage
Refer to the example at `examples/express.js` for usage.
