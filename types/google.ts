export interface Google_User_Profile {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

export interface Gmail {
    sender: {
        email: string
        name: string
    }
    receiver_email: string
    mail: {
        subject: string
        body: {
            text: string
            html?: string
        }
        attachments?: [{
            filename: string
            path: string
            contentType: string
        }]
    }
    client_id: string
    client_secret: string
    access_token: string
    refresh_token: string
}