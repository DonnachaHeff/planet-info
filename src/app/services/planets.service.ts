import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class PlanetsService {
    constructor(
        private http: HttpClient
    ){}

    getPlanetDetails(planetUrl: string) {
        return this.http.get(planetUrl);
    }
}