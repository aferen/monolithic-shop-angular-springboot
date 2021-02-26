import { Authority } from "./authority.model";

export class User {
    id:string;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    verification: string;
    verified: boolean;
    authorities: [Authority];
    password?: string;
    confirmPassword?: string;
    photoURL?: string;
}
