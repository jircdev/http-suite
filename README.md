# README.md for http-suite

## Introduction

`http-suite` is a comprehensive JavaScript package designed to simplify interactions with APIs. The core of this package
is the `Api` object, which provides an easy-to-use interface for making HTTP requests to an API.

## Installation

To install `http-suite`, run the following command in your project directory:

```bash
npm install http-suite
```

## Usage

### Creating an Instance of `Api`

Start by importing the `Api` class and creating an instance:

```javascript
import { Api } from 'http-suite/api';

const baseUrl = 'https://your-api-url.com';
const api = new Api(baseUrl);
```

### Setting Authentication

If your API requires authentication, use the `bearer` method to set the token:

```javascript
api.bearer('your-auth-token');
```

### Making Requests

`http-suite` supports various HTTP methods like `GET`, `POST`, `PUT`, `DELETE`, and custom stream methods.

#### GET Request

```javascript
const response = await api.get('/path/url');
```

#### POST Request

```javascript
const postData = { key: 'value' };
const postResponse = await api.post('/path/post-url', postData);
```

#### PUT Request

```javascript
const putData = { key: 'updated-value' };
const putResponse = await api.put('/path/put-url', putData);
```

#### DELETE Request

```javascript
const deleteResponse = await api.delete('/path/delete-url');
```

#### Stream Request

```javascript
const streamResponse = await api.stream('/path/stream-url');
```

## Features

-   **Easy API interactions:** Simplifies the process of making HTTP requests.
-   **Bearer token authentication:** Easily set authentication tokens for API requests.
-   **Supports multiple HTTP methods:** `GET`, `POST`, `PUT`, `DELETE`, and streaming.
-   **Reactive model integration:** Utilizes `ReactiveModel` for state management in API interactions.
-   **Stream processing:** Offers a unique way to handle streaming data with custom actions and events.

## Contributing

Contributions are welcome! Please submit a pull request or an issue on the project's GitHub page.

## License

`http-suite` is licensed under [MIT License](https://opensource.org/licenses/MIT).

---

Please ensure to modify the example code and descriptions to suit your specific API's needs and structure.
