export interface User_With_Federated_Credentials {
    id: string;
    name: string;
    email: string;
    country_code: string | null;
    phone_number: string | null;
    created_at: string;
    updated_at: string;
    picture: string;
    provider: string;
    access_token: string;
    refresh_token: string;
    user_id: number;
}