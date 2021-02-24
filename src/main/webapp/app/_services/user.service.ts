import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@app/models';
import { SERVER_API_URL } from '@app/app.constants';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(SERVER_API_URL+'api/users');
    }

    getById(id: number) {
        return this.http.get<User>(SERVER_API_URL+`api/users/${id}`);
    }
}
