import { User } from "../../auth/interfaces/user.interface";

export interface Client {
    id:                 string;
    user_id:            string;
    stripe_customer_id: string;
    rating:             string;
    cantidad_ratings:   number;
    created_at:         Date;
    updated_at:         Date;
    user:               User;
}