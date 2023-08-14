# WildFire

## Getting Started

To run the application, you will need environment variables to allow logging in with Github. These can be created for free by:

1. Go to your github account's settings page
1. From the left panel select **Developer settings**
1. Select **OAuth Apps** and Click **New OAuth App**
1. Fill in the **Application Name** with any name. Set the **Homepage URL** to `http://localhost:3000` and the **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`, and the register the application.

This app can be used to populate a new env file: 

1. Copy the contents of `.env.example` into a new `.env` file (in the same directory).
1. Copy the **Client ID** from your new OAuth app and set it to `GITHUB_ID` in the .env file.
1. From your OAuth app, click on **Generate a new client secret**. Copy the new secret into the `GITHUB_SECRET` env variable in the .env file.
1. Generate a JWT_SECRET, e.g by running `openssl rand -base64 32`, and add it to the env file. 

The webapp can now be run with docker by running (the first build will take some time):
- `docker-compose up`

Alternatively, you can run in a hot-reloading environment by running:
- `npm install`
- `npm run dev`

## Deployment

This application is deployed continuously deployed [Vercel](https://vercel.com/docs/concepts/deployments) when code is merged into main. It can additionally be built as a docker image and run in any container based environment, such as Heroku or a Kubernetes Cluster. To build, run:
- `docker build -t <image-tag> .`

## CI/CD

- A [github actions workflow](./.github/workflows/lint-test-builld.yaml) is included to run code-linting, unit-tests, and check for a passing build whenever a new pull-request to the main branch is opened
- Vercel hooks are setup to deploy a development application for new pull requests in the github repository (helpful for reviews).
- Vercel hooks are setup to redeploy the production application when new code is added to the main branch on Github.

## Linting/Testing

- The codebase can be linted (using eslint) with: `npm run lint`
- Unit tests can be run with: `npm run test`

## Build Locally

To preview the built app locally, run:
- `npm run build`
- `npm run start`
