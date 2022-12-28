
import './bootstrap-globals';
import { createExpressHandler, twilioNotification } from './createExpressHandler';
import express, { RequestHandler } from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { ServerlessFunction } from './types';
import room from "./models/room.model";

const PORT = process.env.PORT ?? 8081;

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'))
// app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// This server reuses the serverless endpoints from the "plugin-rtc" Twilio CLI Plugin, which is used when the "npm run deploy:twilio-cli" command is run.
// The documentation for this endpoint can be found in the README file here: https://github.com/twilio-labs/plugin-rtc
const tokenFunction: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/token').handler;
const tokenEndpoint = createExpressHandler(tokenFunction);

const recordingRulesFunction: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/recordingrules')
  .handler;
const recordingRulesEndpoint = createExpressHandler(recordingRulesFunction);
const noopMiddleware: RequestHandler = (_, __, next) => next();
const authMiddleware =
  process.env.REACT_APP_SET_AUTH === 'firebase' ? require('./firebaseAuthMiddleware') : noopMiddleware;

app.all('/token', authMiddleware, tokenEndpoint);
app.all('/recordingrules', authMiddleware, recordingRulesEndpoint);
app.get('/notification',authMiddleware, twilioNotification)
app.use('/room', require('./routes'))


app.use((req, res, next) => {
  // Here we add Cache-Control headers in accordance with the create-react-app best practices.
  // See: https://create-react-app.dev/docs/production-build/#static-file-caching
  if (req.path === '/' || req.path === 'index.html') {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(__dirname, '../build/index.html'), { etag: false, lastModified: false });
  } else {
    res.set('Cache-Control', 'max-age=31536000');
    next();
  }
});

app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (_, res) => {
  // Don't cache index.html
  res.set('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, '../build/index.html'), { etag: false, lastModified: false });
});


async function checkExpiration (){ 
  //check if past expiration date
  room.getRooms().then(data=>{
    for(let dataRoom of data){
      let date = new Date(dataRoom.updatedAt)
      let newDate =  date.setHours(date.getHours() + 1);
      console.log(new Date(newDate) < new Date(), dataRoom.updatedAt,newDate, new Date(newDate), new Date(dataRoom.updatedAt), new Date())
      if(new Date(newDate) < new Date() && dataRoom.inRoomAdded == null){
        room.deleteRoom(data.id).then(deleteRoom =>{
          console.log(deleteRoom)
        })
      }
    }
  })
  
}

function myFunction() {
  var myinterval = 10*1000; // 10 Sec interval
  setInterval(function(){ checkExpiration(); }, myinterval );
}

myFunction();

app.listen(PORT, async() =>{ 
  // await connection.sync({alter:true});
  console.log(`twilio-video-app-react server running on ${PORT}`)});
