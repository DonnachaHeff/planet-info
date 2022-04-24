import { UserModel } from './../models/user.model';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(
        private http: HttpClient
    ){}

    getUsers(): Observable<UserModel> {
        return this.http.get<UserModel>('https://swapi.dev/api/people/');
    }
}