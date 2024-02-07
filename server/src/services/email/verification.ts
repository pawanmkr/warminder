import dns from "node:dns";

function validate_and_separate_out_email(email: string) {
  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;
  const match = email.match(emailRegex);

  if (match) {
    return `${match[2]}.${match[3]}`;
  } else {
    return null;
  }
}

export async function verify_and_validate_email(email: string) {
  const hostname = validate_and_separate_out_email(email);
  if (hostname === null) {
    throw new Error("Invalid email format");
  }

  try {
    await new Promise((resolve, reject) => {
      dns.resolveMx(hostname, (err, addresses) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(addresses);
        }
      });
    });
  } catch (err) {
    throw Error("Email verification failed.");
  }
}


