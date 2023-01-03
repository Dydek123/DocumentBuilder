import * as express from 'express';
import {createConnection} from "typeorm";
import { Server } from "./Server";

const app = express();

createConnection().then(async connection => {
    const server = new Server(app);
    let port = parseInt(process.env.PORT || '');
    if(isNaN(port) || port ===0 ) port= 8080;
    server.start(port);
}).catch(error => console.log(error));
