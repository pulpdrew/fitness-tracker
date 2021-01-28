# Fitness Tracker

This is an open source web-application for tracking individual performance and progress on exercises. Users can record workouts, complete sets of customizable exercises, and track their progress over time. There are no ads and no tracking - all data is stored locally in an exportable format in the user's browser, never leaving the user's machine.

## Install Dependencies:

To install the project dependencies, run:

```
npm install
```

## Serving the application

To serve the application in development mode, run

```
ng serve
```

For production deployments of the application, use `ng build --prod` to compile static files that can be served by any HTTP Server.

## Contributing:

Before committing, run the following and make sure to fix any reported problems:

```
npm run format
npm run lint
ng test --configuration=test
```

Husky will run the latter two automatically before a commit.
