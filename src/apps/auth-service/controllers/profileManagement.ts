import { Response } from "express";
import { User } from "../services/dbServices.js";
import { ExtendedRequest } from "../../../shared/types.js";

export async function getUser(req: ExtendedRequest, res: Response) {
  const userId = parseInt(req.params.id);

  const user = await User.getUserById(userId);
  if (!user) {
    return res.status(404).send("User does not exists");
  }

  if (req.user && req.user.user_id != user.id) {
    return res.status(404).send("Invalid Credentials");
  }

  return res.status(200).json({
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    emailVerified: user.emailVerified,
  });
}

export async function updateUser(req: ExtendedRequest, res: Response) {
  const userId = parseInt(req.params.id);

  if (req.user && req.user.user_id != userId) {
    return res.status(404).send("Invalid Credentials");
  }

  const fields = req.body;
  fields["updatedAt"] = new Date();

  await User.updateUser(fields, userId);
  return res.status(201).send("Fields updated succesfully");
}

export async function deactivateUser(req: ExtendedRequest, res: Response) {
  const userId = parseInt(req.params.id);

  if (req.user && req.user.user_id != userId) {
    return res.status(404).send("Invalid Credentials");
  }

  await User.deactivateUser(userId);
  return res.status(201).send("Account Deactivated Sucessfully!");
}

export async function deleteUser(req: ExtendedRequest, res: Response) {
  const userId = parseInt(req.params.id);

  if (req.user && req.user.user_id != userId) {
    return res.status(404).send("Invalid Credentials");
  }

  await User.deleteUser(userId);
  return res.status(201).send("Deletion succesfull");
}

// TODO: unarchive function
