import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../../configs/config.js";
import { ExtendedRequest } from "../shared/types.js";

export default async function verify_jwt_token(req: ExtendedRequest, res: Response, next: NextFunction) {
  const auth_header: string = req.headers.authorization || "";
  const token: string = (auth_header && auth_header.split(" ")[1]) || "";

  if (token) {
    jwt.verify(
      token,
      config.jwtSecret,
      (err: jwt.VerifyErrors | null, user: any) => {
        if (err) {
          console.error(err);
          return res
            .status(403)
            .json({ error: "Failed to authenticate token." });
        }
        req.user = user;
        next();
      },
    );
  } else {
    res.status(401).send("Authorization Token is Missing");
  }
}
