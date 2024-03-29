import { UsersModel, UsersModelSchema } from './../models/user.model';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';
import { z } from 'zod';
import { tap } from 'rxjs';
import { parseResponse } from '../utils/parse-response.operator';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(
        private http: HttpClient
    ){}

    getUsers(pageNumber?: number): Observable<UsersModel> {
        if (pageNumber) {
            return this.http.get<UsersModel>(`https://swapi.dev/api/people/?page=${pageNumber}`).pipe(
                parseResponse(UsersModelSchema)
            );
        }
        return this.http.get<UsersModel>('https://swapi.dev/api/people/').pipe(
    parseResponse(UsersModelSchema)
        );
    }
}