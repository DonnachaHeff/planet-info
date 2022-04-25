import { UsersModel } from './../models/user.model';
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

    getUsers(): Observable<UsersModel> {
        return this.http.get<UsersModel>('https://swapi.dev/api/people/');
    }
}