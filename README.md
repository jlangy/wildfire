# WildFire

This is a web application to view fire information. You can visit the live site at [https://wildfire-nu.vercel.app](https://wildfire-nu.vercel.app).

## Getting Started

To run the application, you will need an OAuth App with Github for authetication, and to populate some environment variables.

1. Create A Github OAuth Application:

    - Go to your github account's settings page
    - From the left panel select **Developer settings**
    - Select **OAuth Apps** and Click **New OAuth App**
    - Fill in the **Application Name** with any name. Set the **Homepage URL** to `http://localhost:3000` and the **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`, and then register the application. If reusing this app for a deployed environment, remember to update these urls.

2. The new OAuth App from above can be used to populate a new env file: 
    - Copy the contents of `.env.example` into a new file named `.env` (in the same directory).
    - Copy the **Client ID** from your new OAuth app and set it to `GITHUB_ID` in the `.env` file.
    - From your OAuth app, click on **Generate a new client secret**. Copy the new secret into the `GITHUB_SECRET` env variable in the `.env` file.
    - Generate a JWT_SECRET, e.g by running `openssl rand -base64 32` in your terminal, and add it to the `.env` file. 

The webapp can now be run with docker by running:
- `docker-compose up`

Alternatively, you can run in a hot-reloading environment by running:
- `npm install`
- `npm run dev`

## Deployment

This application is continuously deployed to [Vercel](https://vercel.com/) when code is merged into main. See [here](https://vercel.com/docs/concepts/deployments/git#deploying-a-git-repository) for information on setting up a new project. To check the vercel build locally, run:

- `npm run build`
- `npm start`

 It can additionally be built as a docker image and run in any container based environment, such as Heroku or a Kubernetes Cluster. To build, run:
- `docker build -t <image-tag> .`

## CI/CD

- A [github actions workflow](./.github/workflows/lint-test-builld.yaml) is included to run code-linting, unit-tests, and check for a passing build whenever a new pull-request to the main branch is opened
- Vercel hooks are setup to deploy a development application for new pull requests in the github repository (helpful for reviews).
- Vercel hooks are setup to redeploy the production application when new code is added to the main branch on Github.

## Linting/Testing

- The codebase can be linted (using eslint) with: `npm run lint`
- Tests can be run with: `npm run test`

## Architecture Decisions

For the design of this applications, I chose to use the NextJS framework for React. Since this is a small web application consuming a public API, I new [react](https://react.dev/) would fit well for quickly building a reactive interface while making different AJAX requests. I chose NextJS as a framework to include a lightweight backend server for Authentication, as well as take advantage of server-side rendered components.

To meet the authentication requirements, I included an open access landing page, and an authentcation required page (the map). Since we were provided a public API to consume, AJAX requests are sent directly to the API and not proxied through the application's API. Authenticated api routes can be easily added to this server by including new files in the [api](./src/pages/api) folder and checking the provided session.

For the UI, I chose to use the Material UI component library consistently for a clean look and feel, and to be able to easily theme the app with some BCGov styles if time permitted. I chose to use Leaflet for mapping since it is open and free. 

For data flow, all data is fetched on initial map load. I decided not to use the downloaded GeoJSON from this initial request when filtering, even though that would have a faster feel. I chose this because the list of fires and their statuses could change at any time, so I wanted to ensure any newly applied filters were re-fetching up to date information.