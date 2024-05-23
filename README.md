# Simple ToDo

Simple To Do List, is an web application for tracking and managing your everyday tasks.

## Installation (Locally)

Install necessary libraries first

```bash
npm install
```

Configure config/config.json file to match your PostgreSQL details if required

Run these commands to create your database and schema

```bash
npx sequelize-cli db:create --env production
npx sequelize-cli db:migrate -–env production
```

Run this command to seed database with a demo user (Optional)

```bash
npx sequelize-cli db:seed:all --env production
```

```JSON
// Demo User credentials
{
  username: 'johndoe',
  email: 'john@gmail.com',
  password: 'password',
}
```

## Running of Server

Run this command

```bash
npm run start
```

This will start the npm server and build the webpack bundle

## Allow time for the webpack bundle to be built
