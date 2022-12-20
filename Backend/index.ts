import * as express from 'express';
import { Server } from "./Server";

const app = express();

const server = new Server(app);
let port = parseInt(process.env.PORT || '');
if(isNaN(port) || port ===0 ) port= 8080;
server.start(port);
