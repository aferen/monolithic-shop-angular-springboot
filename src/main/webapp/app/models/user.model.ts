export class User {
    id:string;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    verification: string;
    verified: boolean;
    authorities: string[];
    password?: string;
    confirmPassword?: string;
    photoURL?: string;
}
