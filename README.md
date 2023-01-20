# Twilio Telehealth React App

## Prerequisites

You must have the following installed:

- [Node.js v14+](https://nodejs.org/en/download/)
- NPM v6+ (comes installed with newer Node versions)
- PM2
- Rsync (if using Twilio CI Action to build on Github and copy to server including .env creation)

You can check which versions of Node.js and NPM you currently have installed with the following commands:

    node --version
    npm --version

## Clone the repository

Clone this repository and cd into the project directory:

    sudo mkdir twilio-video-app-react
    sudo chown <username> twilio-video-app-react
    git clone https://github.com/MedRepublic/twilio-video-app-react.git
    cd twilio-video-app-react
    git checkout developer

## Install Dependencies

Run `npm install` inside the main project folder to install all dependencies from NPM.

If you want to use `yarn` to install dependencies, first run the [yarn import](https://classic.yarnpkg.com/en/docs/cli/import/) command. This will ensure that yarn installs the package versions that are specified in `package-lock.json`.

## Environment Variable
Create .env file in main project folder.
Put keys in this file:
TWILIO_ACCOUNT_SID=AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_API_KEY_SID=SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_API_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=2XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_DISABLE_TWILIO_CONVERSATIONS=true (If conversation need in app than comment this)

All Twilio keys are found in twilio console

## Run on local

Run `npm start` inside the main project folder

## Run on production

1. Run `npm run build`.
2. Go inside server folder
3. Run `pm2 start "npm run server"`
