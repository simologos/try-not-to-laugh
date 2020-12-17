

import { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const cancelRequest = (res: Response) => {
  res
    .status(StatusCodes.UNAUTHORIZED)
    .send(ReasonPhrases.UNAUTHORIZED)
    .end();
};

export const isAuthenticated = (req: Request<{}, {}, any>, res: Response, next: NextFunction) => {

  try {
    // @ts-ignore
    const user = req.session.passport.user;

    if (user !== null) {
      next();
      return;
    }

    cancelRequest(res);
  } catch(e){
    cancelRequest(res);
  }
};