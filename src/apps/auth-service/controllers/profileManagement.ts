import { Request, Response } from "express";
import { User } from "../services/dbServices.js";
import { errorInResponse } from "../utils/index.js";

export async function getUserProfile(req: Request, res: Response) {
  const userId = parseInt(req.query.user_id as string);
  const user = await User.getUserById(userId);
  if (!user[0]) {
    return errorInResponse(res, 404, "User does not exists");
  } else {
    return res.status(200).json({
      userId: user[0].id,
      name: user[0].name,
      email: user[0].email,
      emailVerified: user[0].emailVerified,
      role: user[0].userType,
    });
  }
}

export async function updateUserProfile(req: Request, res: Response) {
  const userId = parseInt(req.query.user_id as string);

  const fields = Object.entries(req.body).map(([key], index) => {
    return `${key} = $${index + 1}`;
  });

  const values: string[] = Object.entries(req.body).map(([values]) => {
    return values as string;
  });

  fields.push(`updated_at = $${fields.length + 1}`);
  values.push(new Date().toISOString().replace("T", " ").replace("Z", " "));
  values.push(userId.toString());

  await User.updateUser(fields);
  return res.status(201).send("Fields updated succesfully");
}

export async function deactivateUser(req: Request, res: Response) {
  const userId = parseInt(req.query.user_id as string);

  await User.deactivateUser(userId);
  return res.status(201).send("Account Deactivated Sucessfully!");
}

export async function deleteUser(req: Request, res: Response) {
  const userId = parseInt(req.query.user_id as string);
  await User.deleteUser(userId);
  return res.status(201).send("Deletion succesfull");
}

// TODO: unarchive function
