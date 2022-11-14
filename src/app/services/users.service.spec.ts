import { of } from 'rxjs';
import { UsersModel } from './../models/user.model';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
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
        it('should call get with expected url when pageNumber is undefined', fakeAsync(async () => {
            // Arrange
            httpClientSpy.get.and.returnValue(of({} as UsersModel))

            // Act
            service.getUsers();
            tick();

            // Assert
            expect(httpClientSpy.get).toHaveBeenCalledWith('https://swapi.dev/api/people/');
        }));

        it('should call get with expected url when pageNumber defined', fakeAsync(async () => {
            // Arrange
            httpClientSpy.get.and.returnValue(of({} as UsersModel));

            // Act
            service.getUsers(2);
            tick();

            // Assert
            expect(httpClientSpy.get).toHaveBeenCalledWith('https://swapi.dev/api/people/?page=2');
        }));
    });
});