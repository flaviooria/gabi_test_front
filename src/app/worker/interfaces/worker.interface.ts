import { User } from "../../auth/interfaces/user.interface";

export interface Worker {
    id:               string;
    dni:              string;
    user_id:          string;
    bio:              string;
    services_id:      string;
    disponibilidad:   string;
    rating:           string;
    cantidad_ratings: number;
    active:           boolean;
    created_at:       Date;
    updated_at:       Date;
    user:             User;
}