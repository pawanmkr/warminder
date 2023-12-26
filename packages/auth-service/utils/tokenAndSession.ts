import jwt, { JwtPayload } from "jsonwebtoken";
import { Session } from "../models/index.js";
import { Tokens } from "../types/index.js";

export class Token {
  static generateAccessToken(userId: number, userType: string, privateKey: string): string {
    const payload: JwtPayload = {
      user_id: userId,
      user_type: userType
    };
    return jwt.sign(payload, privateKey, {
      expiresIn: '1h'
    });  
  }
  
  static generateRefreshToken(userId: number, privateKey: string): string {
    return jwt.sign({ user_id: userId  }, privateKey, {
      expiresIn: '365d'
    });  
  }

  /* 
   * Creating a timestamp in Epoch format 
   * for respective days or hours in future from now
   * i.e. the expiry time of refresh token generated in respective token
   */
  static generateEpochTimestampInHours(hours: number): number {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + hours);
    return currentDate.getTime();
  }
  
  static generateEpochTimestampInDays(days: number): number {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 24 * days);
    return currentDate.getTime();
  }
  
  static async createNewSession(id: number, userType: string, privateKey: string): Promise<Tokens> {
    const accessToken = this.generateAccessToken(id, userType, privateKey);
    const refreshToken = this.generateRefreshToken(id, privateKey);
    
    const expiry = this.generateEpochTimestampInDays(365);
    
    // saving session details to db
    await Session.grantNewSession(refreshToken, expiry, id);
  
    return {
      accessToken,
      refreshToken,
    }
  }
}