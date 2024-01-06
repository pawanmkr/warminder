import { Response } from "express";
import { Company } from "./services/db.js";
import { User } from "../auth/services/dbServices.js";
import { ExtendedRequest } from "../../shared/types.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import { verify_and_validate_email } from "../../services/email/verification.js";

// Routes for managing company data

/**
 * Adds a new company to the database.
 *
 * @param req ExtendedRequest - The request object, containing user information and company details.
 * @param res Response - The response object to send back to the client.
 */
export async function add_company(req: ExtendedRequest, res: Response) {
    const { name, location, email, size, website, tags } = req.body;

    // Validate user existence
    if (!req.user) {
        throw new Error("Internal server error: User not found");
    }
    const user_id = req.user.user_id;

    const user_exists = await User.find_existing_user(user_id, null);
    if (!user_exists) {
        return res.status(404).send("User Does Not Exists");
    }

    // Check, if email already exists or not in my database
    const email_exists = await Company.does_email_already_exists(email);
    if (email_exists) {
        return res.status(404).send("Email Already Exists in our database, Try Again with another Valid Email.");
    }

    try {
        await verify_and_validate_email(email);
    } catch (error) {
        if (!res.headersSent) {
            return res.status(406).send("Invalid Email Address Provided.");
        }
    }

    // Save company and related data to the database
    let company_id: number;
    try {
        const { id } = await Company.save_company(name, location, size == undefined ? 0 : size, website == undefined ? "" : website);
        company_id = id;
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
            // Handle the error appropriately, e.g., inform the user or suggest a different name/location
            return res.status(409).json({
                error: `A company with Name: ${name} & location: ${location} already exists.`,
                message: "You should directly add a new Email instead."
            });
        } else {
            // Rethrow the error or handle other error types
            throw error;
        }
    }

    await Company.save_email(email, company_id, user_id);

    const saved_tags = [];
    // Save Multiple Tags Asynchronously
    for await (const tag of tags) {
        try {
            const res = await Company.get_tag(tag);
            if (res !== null) {
                const confirmation = await Company.save_tag(company_id, res.id);
                saved_tags.push(confirmation);
            }
        } catch (e) {
            console.error(e);
        }
    }

    /*
   * Separately keeping records of saved tags to make sure
   * the user is aware of what tags have been saved successfully,
   * because there is an edge case where user can accidentally input the tag
   * which does not exits in the database and is made up by user which is not acceptable.
   */
    req.body.tags = saved_tags;

    res.status(201).json({
        id: company_id,
        ...req.body, // Include company details in the response
    });
}


/**
 * Updates the email of a company.
 */
export async function add_new_email(req: ExtendedRequest, res: Response) {
    const { email } = req.body;
    const company_id = parseInt(req.params.company_id);

    // Validate user existence
    if (!req.user) {
        throw new Error("Internal server error: User not found");
    }

    try {
    // Update email whichever is requested
        await Company.save_email(email, company_id, req.user.user_id);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
            return res.sendStatus(409);
        } else {
            // Rethrow the error or handle other error types
            throw error;
        }
    }

    res.send("Details Updated Successfully!");
}


/**
 * Fetches all companies from the database.
 */
export async function get_all_the_companies(req: ExtendedRequest, res: Response) {
    const companies = await Company.get_all_the_companies();
    res.send(companies);
}
