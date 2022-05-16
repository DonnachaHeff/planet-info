import { PlanetsService } from './planets.service';
import { TestBed } from '@angular/core/testing';
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
        it('should call get with expected url when pageNumber is undefined', () => {
            // Arrange
            const planetUrl = 'https://swapi.dev/api/people/?page=2';
            httpClientSpy.get.and.callThrough();

            // Act
            service.getPlanetDetails(planetUrl);

            // Assert
            expect(httpClientSpy.get).toHaveBeenCalledWith(planetUrl);
        });
    });
});