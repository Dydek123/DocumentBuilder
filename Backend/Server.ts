import { Express, Request, Response } from "express";
import * as express from 'express';
import * as path from "path";
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';

export class Server {
  private app: Express;

  constructor(app: Express) {
      this.app = app;

      this.app.use(express.static(path.resolve("/") + '/build/frontend'));
      this.app.use(logger('dev'));
      this.app.use(express.json());
      this.app.use(express.urlencoded({extended: false}));
      this.app.use(cookieParser());

      this.app.get("*", (req: Request, res: Response): void => {
          res.send('Hello from routing');
      })
  }

  public start(port: number): void {
      this.app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
  }
}
