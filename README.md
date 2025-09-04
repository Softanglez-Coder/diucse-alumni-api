Hello and welcome to DIU CSE Alumni APIs repository. This is the heart of almni association's online management system. Let's walk you through the journey.

# Getting Started

To run this application, first fill up the `.env` or `.env.local` file with appropreate values. The `.env.example` has clear instruction how to do that. After filling up the file please up and run the database (mongodb) to your machine.

If the mongodb database is not present in your system, kindly [follow these steps][setup_mongodb_in_local] to setting up and run the mongodb in your local machine via Docker.

If everything setup, then you are good to go.

## Install dependencies

Make sure you are using Node version `20` or later. We recommend using [Yarn][yarn_documentation] as the package manager for this project. To install the dependencies, run:

```bash
yarn install
```

## Running the Application

To start the application, run the following command:

```bash
yarn start
```

This will start the server on the default port (usually `3000`). You can access the API at `http://localhost:3000`.

# Documentation

For detailed documentation how the application works, the user flow, and the API endpoints, please refer to the [documentation folder][docs].

# APIs

The APIs are designed to be RESTful and follow standard conventions. You can find the API documentation in the Postman collection [hosted here][postman_collection]. The collection includes all the endpoints, request parameters, and response formats.

# Contributing

We welcome contributions to this project! If you have any ideas, bug fixes, or improvements, please feel free to open a pull request. Before contributing, please read our [contributing guidelines][contributing_guideline].

# License

This project is licensed under the MIT License. See the [LICENSE][license] file for details.

# Contact

If you have any questions or need assistance, feel free to reach out to us via the [contact page](./docs/contact.md) or open an issue in the repository.

[setup_mongodb_in_local]: ./docs/setup-local-environment.md
[yarn_documentation]: https://yarnpkg.com/getting-started/install
[docs]: ./docs
[license]: ./LICENSE
[postman_collection]: https://www.postman.com/devlikhon/workspace/diu-cse-alumni/collection/11335698-ea46de0a-2cc7-459b-9415-1cc1565d772e?action=share&creator=11335698&active-environment=11335698-55d60770-3db8-40ec-a4e8-d2a484baab6e
[contributing_guideline]: ./CONTRIBUTING.md
