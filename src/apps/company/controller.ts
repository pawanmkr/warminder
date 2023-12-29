import { Response } from "express";
import { Company } from "./services/db.js";
import { User } from "../auth/services/dbServices.js";
import { ExtendedRequest } from "../../shared/types.js";

// Routes for managing company data

/**
 * Adds a new company to the database.
 *
 * @param req ExtendedRequest - The request object, containing user information and company details.
 * @param res Response - The response object to send back to the client.
 */
export async function add_company(req: ExtendedRequest, res: Response) {
  const { name, location, email } = req.body;

  // Validate user existence
  if (!req.user) {
    throw new Error("Internal server error: User not found");
  }

  const userExists = await User.findExistingUser(req.user.user_id, null);
  if (!userExists) {
    return res.status(404).send("User Does Not Exists");
  }

  // TODO: Implement email validation/verification

  // Save company and related data to the database
  const company = await Company.save_company(name, location);
  await Company.save_email(email, company[0].id, req.user.user_id);

  res.json({
    id: company[0].id,
    ...req.body, // Include company details in the response
  });
}

/**
 * Updates the email of a company.
 */
export async function update_company_details(
  req: ExtendedRequest,
  res: Response,
) {
  const { email } = req.body;
  const id = parseInt(req.params.id);

  // Validate user existence
  if (!req.user) {
    throw new Error("Internal server error: User not found");
  }

  // Update email whichever is requested
  await Company.save_email(email, id, req.user.user_id);

  res.send("Details Updated Successfully!");
}

/**
 * Fetches all companies from the database.
 */
export async function get_all_the_companies(
  req: ExtendedRequest,
  res: Response,
) {
  const companies = await Company.get_all_the_companies();
  res.send(companies);
}
