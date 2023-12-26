import { Request, Response } from "express";
import { User } from "../models/index.js";
import { errorInResponse } from "../utils/index.js";

export async function getUserProfile(req: Request, res: Response) {
  const userId = parseInt(req.query.user_id as string);
  const user = await User.getUserProfileById(userId);
  if (!user) {
    return errorInResponse(res, 404, `User does not exists`);
  } else {
    return res.status(200).json({
      userId: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      userName: user.username,
      email: user.email,
      emailVerified: user.email_verified,
      role: user.user_type
    });
  }
}

export async function updateUserProfile(req: Request, res: Response) {
  const userId = parseInt(req.query.user_id as string);
  const { updated_by } = req.body;
  const existingUser = await User.findExistingUser(updated_by, null, null);
  if (!existingUser) {
    return errorInResponse(res, 404, "You cannot make updates to the profile");
  }

  const fields = Object.entries(req.body).map(([key], index) => {
    return `${key} = $${index + 1}`
  });
  const values: string[] = Object.entries(req.body).map(([key, values]) => {
    return values as string
  });
  
  fields.push(`updated_at = $${fields.length + 1}`);
  values.push(new Date().toISOString().replace('T', ' ').replace('Z', ' '))
  values.push(userId.toString());
  
  await User.updateUserProfileById(fields, values);
  return res.status(201).send("Fields updated succesfully");
}

export async function archiveUserProfile(req: Request, res: Response) {
  const userId = parseInt(req.query.user_id as string);
  const { archived_by } = req.body;
  const existingUser = await User.findExistingUser(archived_by, null, null);
  if (!existingUser) {
    return errorInResponse(res, 404, "You cannot make changes to the profile");
  }
  const archived_at = new Date().toISOString().replace('T', ' ').replace('Z', ' ');
  await User.archiveUserProfileById(userId, archived_by, archived_at);
  return res.status(201).send("User Archived succesfully");
}

export async function deleteUserProfile(req: Request, res: Response) {
  const userId = parseInt(req.query.user_id as string);
  await User.deleteUserProfileById(userId);
  return res.status(201).send("Deletion succesfull");
}

// TODO: unarchive function