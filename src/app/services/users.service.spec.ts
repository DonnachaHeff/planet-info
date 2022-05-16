import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { UsersService } from './users.service';

describe('UsersService', () => {
    let service: UsersService;

    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);

        TestBed.configureTestingModule({
            providers: [
                UsersService,
                { provide: HttpClient, useValue: httpClientSpy },
            ]
        });

        service = TestBed.inject(UsersService);
    });

    describe('getUsers', () => {
        it('should call get with expected url when pageNumber is undefined', () => {
            // Arrange
            httpClientSpy.get.and.callThrough();

            // Act
            service.getUsers();

            // Assert
            expect(httpClientSpy.get).toHaveBeenCalledWith('https://swapi.dev/api/people/');
        });

        it('should call get with expected url when pageNumber defined', () => {
            // Arrange
            httpClientSpy.get.and.callThrough();

            // Act
            service.getUsers(2);

            // Assert
            expect(httpClientSpy.get).toHaveBeenCalledWith('https://swapi.dev/api/people/?page=2');
        });
    });
});