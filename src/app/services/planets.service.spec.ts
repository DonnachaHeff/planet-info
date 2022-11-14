import { PlanetModel } from './../models/planet.model';
import { of } from 'rxjs';
import { PlanetsService } from './planets.service';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

describe('PlanetsService', () => {
    let service: PlanetsService;

    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);

        TestBed.configureTestingModule({
            providers: [
                PlanetsService,
                { provide: HttpClient, useValue: httpClientSpy },
            ]
        });

        service = TestBed.inject(PlanetsService);
    });

    describe('getPlanetDetails', () => {
        it('should call get with expected url when pageNumber is undefined', fakeAsync(async () => {
            // Arrange
            const planetUrl = 'https://swapi.dev/api/people/?page=2';
            httpClientSpy.get.and.returnValue(of({} as PlanetModel));

            // Act
            service.getPlanetDetails(planetUrl);
            tick();

            // Assert
            expect(httpClientSpy.get).toHaveBeenCalledWith(planetUrl);
        }));
    });
});