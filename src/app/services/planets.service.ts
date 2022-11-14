import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PlanetModel, PlanetModelSchema } from '../models/planet.model';
import { parseResponse } from '../utils/parse-response.operator';

@Injectable({
    providedIn: 'root'
})
export class PlanetsService {
    constructor(
        private http: HttpClient
    ){}

    getPlanetDetails(planetUrl: string): Observable<PlanetModel> {
        return this.http.get<PlanetModel>(planetUrl).pipe(
            parseResponse(PlanetModelSchema)
        );
    }
}