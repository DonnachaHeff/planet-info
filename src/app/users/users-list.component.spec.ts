import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { of, Subscription } from 'rxjs';
import { PlanetModel } from './../models/planet.model';
import { UserModel, UsersModel } from './../models/user.model';
import { PlanetsService } from '../services/planets.service';
import { UsersService } from '../services/users.service';
import { UsersListComponent } from './users-list.component';

describe('UsersListComponent', () => {
    let component: UsersListComponent;

    let userServiceSpy: jasmine.SpyObj<UsersService>;
    let planetsServiceSpy: jasmine.SpyObj<PlanetsService>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj<UsersService>('UserService', ['getUsers']);
        planetsServiceSpy = jasmine.createSpyObj<PlanetsService>('PlanetsService', ['getPlanetDetails']);
        matDialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

        TestBed.configureTestingModule({
            providers: [
                UsersListComponent,
                { provide: UsersService, useValue: userServiceSpy },
                { provide: PlanetsService, useValue: planetsServiceSpy },
                { provide: MatDialog, useValue: matDialogSpy },
            ]
        });

        component = TestBed.inject(UsersListComponent);
    });

    describe('ngOnDestroy', () => {
        it('should call unsubscribe', () => {
            // Arrange
            const unsubscription = spyOn(Subscription.prototype, 'unsubscribe');

            // Act
            component.ngOnDestroy();

            // Assert
            expect(unsubscription).toHaveBeenCalled();
        });
    });

    describe('applyFilter', () => {
        it('should filter users', () => {
            // Arrange
            const expectedResult = [{name: 'Luke'}] as UserModel[];
            const filterValue = {value: 'Luke'} as any;
            component.dataSource = {data: []} as any;
            component.users = {
                results: [ 
                    {name: 'Dave'}, 
                    {name: 'Luke'}, 
                    {name: 'John'}
                ] as UserModel[]
            } as UsersModel;

            // Act
            component.applyFilter(filterValue);

            // Assert
            expect(component.dataSource.data).toEqual(expectedResult);
        });

        it('should return any names which contain the subset of string', () => {
            // Arrange
            const expectedResult = [{name: 'Dave'}, {name: 'Cave'}] as UserModel[];
            const filterValue = {value: 'av'} as any;
            component.dataSource = {data: []} as any;
            component.users = {
                results: [ 
                    {name: 'Dave'}, 
                    {name: 'Cave'}, 
                    {name: 'John'}
                ] as UserModel[]
            } as UsersModel;

            // Act
            component.applyFilter(filterValue);

            // Assert
            expect(component.dataSource.data).toEqual(expectedResult);
        });

        it('should ignore case', () => {
            // Arrange
            const expectedResult = [{name: 'Duke'}, {name: 'Dave'}, {name: 'Jude'}] as UserModel[];
            const filterValue = {value: 'd'} as any;
            component.dataSource = {data: []} as any;
            component.users = {
                results: [ 
                    {name: 'Duke'}, 
                    {name: 'Dave'}, 
                    {name: 'John'},
                    {name: 'Jude'},
                ] as UserModel[]
            } as UsersModel;

            // Act
            component.applyFilter(filterValue);

            // Assert
            expect(component.dataSource.data).toEqual(expectedResult);
        });
    });

    describe('sortData', () => {
        it('should sort by ascending order', () => {
            // Arrange
            const expectedResult = {data: [
                    {name: 'Dave'}, 
                    {name: 'Duke'}, 
                    {name: 'John'},
                    {name: 'Jude'},
            ]};
            const sort = {
                active: 'name',
                direction: 'asc'
            } as Sort;
            component.dataSource = {data: [
                    {name: 'John'},
                    {name: 'Duke'}, 
                    {name: 'Dave'}, 
                    {name: 'Jude'},
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should sort by descending order', () => {
            // Arrange
            const expectedResult = {data: [
                    {name: 'Jude'},
                    {name: 'John'},
                    {name: 'Duke'}, 
                    {name: 'Dave'}, 
            ]};
            const sort = {
                active: 'name',
                direction: 'desc'
            } as Sort;
            component.dataSource = {data: [
                    {name: 'John'},
                    {name: 'Duke'}, 
                    {name: 'Dave'}, 
                    {name: 'Jude'},
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should not sort if not active', () => {
            // Arrange
            const expectedResult = {data: [
                    {name: 'John'},
                    {name: 'Duke'}, 
                    {name: 'Dave'}, 
                    {name: 'Jude'},
            ]};
            const sort = {
                active: null,
                direction: 'asc'
            } as Sort;
            component.dataSource = {data: [
                    {name: 'John'},
                    {name: 'Duke'}, 
                    {name: 'Dave'}, 
                    {name: 'Jude'},
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should not sort if direction is empty', () => {
            // Arrange
            const expectedResult = {data: [
                    {name: 'John'},
                    {name: 'Duke'}, 
                    {name: 'Dave'}, 
                    {name: 'Jude'},
            ]};
            const sort = {
                active: 'name',
                direction: ''
            } as Sort;
            component.dataSource = {data: [
                    {name: 'John'},
                    {name: 'Duke'}, 
                    {name: 'Dave'}, 
                    {name: 'Jude'},
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should sort by height in descending order', () => {
            // Arrange
            const expectedResult = {data: [
                    {name: 'Jude', height: '32'},
                    {name: 'John', height: '28'},
                    {name: 'Duke', height: '14'}, 
                    {name: 'Dave', height: '1'}, 
            ]};
            const sort = {
                active: 'height',
                direction: 'desc'
            } as Sort;
            component.dataSource = {data: [
                    {name: 'John', height: '28'},
                    {name: 'Duke', height: '14'}, 
                    {name: 'Dave', height: '1'}, 
                    {name: 'Jude', height: '32'},
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should sort by height in ascending order', () => {
            // Arrange
            const expectedResult = {data: [
                    {name: 'Dave', height: '1'}, 
                    {name: 'Duke', height: '14'}, 
                    {name: 'John', height: '28'},
                    {name: 'Jude', height: '32'},
            ]};
            const sort = {
                active: 'height',
                direction: 'asc'
            } as Sort;
            component.dataSource = {data: [
                    {name: 'John', height: '28'},
                    {name: 'Duke', height: '14'}, 
                    {name: 'Dave', height: '1'}, 
                    {name: 'Jude', height: '32'},
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should sort by mass in ascending order', () => {
            // Arrange
            const expectedResult = {data: [
                    {name: 'Dave', mass: '10'}, 
                    {name: 'Duke', mass: '140'}, 
                    {name: 'John', mass: '280'},
                    {name: 'Jude', mass: '3200'},
            ]};
            const sort = {
                active: 'mass',
                direction: 'asc'
            } as Sort;
            component.dataSource = {data: [
                    {name: 'John', mass: '280'},
                    {name: 'Jude', mass: '3200'},
                    {name: 'Duke', mass: '140'}, 
                    {name: 'Dave', mass: '10'}, 
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should sort by mass in descending order', () => {
            // Arrange
            const expectedResult = {data: [
                    {name: 'Jude', mass: '3200'},
                    {name: 'John', mass: '280'},
                    {name: 'Duke', mass: '140'}, 
                    {name: 'Dave', mass: '10'}, 
            ]};
            const sort = {
                active: 'mass',
                direction: 'desc'
            } as Sort;
            component.dataSource = {data: [
                    {name: 'John', mass: '280'},
                    {name: 'Jude', mass: '3200'},
                    {name: 'Duke', mass: '140'}, 
                    {name: 'Dave', mass: '10'}, 
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should sort by created in descending order', () => {
            // Arrange
            const expectedResult = {data: [
                    {name: 'Dave', created: '2017-12-09T13:50:51.644000Z'}, 
                    {name: 'Jude', created: '2014-12-09T13:50:51.644000Z'},
                    {name: 'Duke', created: '2014-12-08T13:50:51.644000Z'}, 
                    {name: 'John', created: '2014-11-09T13:50:51.644000Z'},
            ]};
            const sort = {
                active: 'created',
                direction: 'desc'
            } as Sort;
            component.dataSource = {data: [
                    {name: 'John', created: '2014-11-09T13:50:51.644000Z'},
                    {name: 'Jude', created: '2014-12-09T13:50:51.644000Z'},
                    {name: 'Duke', created: '2014-12-08T13:50:51.644000Z'}, 
                    {name: 'Dave', created: '2017-12-09T13:50:51.644000Z'}, 
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should sort by created in ascending order', () => {
            // Arrange
            const expectedResult = {data: [
                    {name: 'John', created: '2014-11-09T13:50:51.644000Z'},
                    {name: 'Duke', created: '2014-12-08T13:50:51.644000Z'}, 
                    {name: 'Jude', created: '2014-12-09T13:50:51.644000Z'},
                    {name: 'Dave', created: '2017-12-09T13:50:51.644000Z'}, 
            ]};
            const sort = {
                active: 'created',
                direction: 'asc'
            } as Sort;
            component.dataSource = {data: [
                    {name: 'John', created: '2014-11-09T13:50:51.644000Z'},
                    {name: 'Jude', created: '2014-12-09T13:50:51.644000Z'},
                    {name: 'Duke', created: '2014-12-08T13:50:51.644000Z'}, 
                    {name: 'Dave', created: '2017-12-09T13:50:51.644000Z'}, 
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should sort by edited in descending order', () => {
            // Arrange
            const expectedResult = {data: [
                    {name: 'Dave', edited: '2017-12-09T13:50:51.644000Z'}, 
                    {name: 'Jude', edited: '2014-12-09T13:50:51.644000Z'},
                    {name: 'Duke', edited: '2014-12-08T13:50:51.644000Z'}, 
                    {name: 'John', edited: '2014-11-09T13:50:51.644000Z'},
            ]};
            const sort = {
                active: 'edited',
                direction: 'desc'
            } as Sort;
            component.dataSource = {data: [
                    {name: 'John', edited: '2014-11-09T13:50:51.644000Z'},
                    {name: 'Jude', edited: '2014-12-09T13:50:51.644000Z'},
                    {name: 'Duke', edited: '2014-12-08T13:50:51.644000Z'}, 
                    {name: 'Dave', edited: '2017-12-09T13:50:51.644000Z'}, 
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should sort by edited in ascending order', () => {
            // Arrange
            const expectedResult = {data: [
                    {name: 'Duke', edited: '2014-12-08T13:50:51.644000Z'}, 
                    {name: 'John', edited: '2014-12-09T13:50:31.644000Z'},
                    {name: 'Jude', edited: '2014-12-09T13:50:51.644000Z'},
                    {name: 'Dave', edited: '2017-12-09T13:50:51.644000Z'}, 
            ]};
            const sort = {
                active: 'edited',
                direction: 'asc'
            } as Sort;
            component.dataSource = {data: [
                    {name: 'John', edited: '2014-12-09T13:50:31.644000Z'},
                    {name: 'Jude', edited: '2014-12-09T13:50:51.644000Z'},
                    {name: 'Duke', edited: '2014-12-08T13:50:51.644000Z'}, 
                    {name: 'Dave', edited: '2017-12-09T13:50:51.644000Z'}, 
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should sort homeworldName by ascending order', () => {
            // Arrange
            const expectedResult = {data: [
                    {homeworldName: 'Earth'}, 
                    {homeworldName: 'Jupiter'},
                    {homeworldName: 'Mars'}, 
                    {homeworldName: 'Venus'},
            ]};
            const sort = {
                active: 'homeworldName',
                direction: 'asc'
            } as Sort;
            component.dataSource = {data: [
                    {homeworldName: 'Jupiter'},
                    {homeworldName: 'Venus'}, 
                    {homeworldName: 'Earth'}, 
                    {homeworldName: 'Mars'},
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });

        it('should sort homeworldName by descending order', () => {
            // Arrange
            const expectedResult = {data: [
                    {homeworldName: 'Venus'},
                    {homeworldName: 'Mars'},
                    {homeworldName: 'Jupiter'}, 
                    {homeworldName: 'Earth'}, 
            ]};
            const sort = {
                active: 'homeworldName',
                direction: 'desc'
            } as Sort;
            component.dataSource = {data: [
                    {homeworldName: 'Jupiter'},
                    {homeworldName: 'Earth'}, 
                    {homeworldName: 'Mars'},
                    {homeworldName: 'Venus'}, 
            ]} as any

            // Act
            component.sortData(sort);

            // Assert
            expect(component.dataSource).toEqual(expectedResult);
        });
    });

    describe('displayPlanetDetails', () => {
        it('should call getPlanetDetails and open matDialog', () => {
            // Arrange
            const homeworld = 'https://https://swapi.dev/api/planets/1/';
            planetsServiceSpy.getPlanetDetails.and.returnValue(of({name: 'Mars'} as PlanetModel));
            matDialogSpy.open.and.callThrough();

            // Act
            component.displayPlanetDetails(homeworld);

            // Assert
            expect(planetsServiceSpy.getPlanetDetails).toHaveBeenCalledOnceWith(homeworld);
            expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
        });
    });

    describe('changePageAndUpdateUsers', () => {
        it('should call getUsers and getPlanetDetails, increase current page, and set expected variables', () => {
            // Arrange
            const expectedPageIndex = 2;
            const pageEvent = {
                pageIndex: 1,
            } as PageEvent;
            userServiceSpy.getUsers.and.returnValue(of({count: 22, results: [{name: 'Luke Skywalker', homeworld: 'https://swapi.dev/api/planets/1/', homeworldName: null}as UserModel] as UserModel[]} as UsersModel));
            planetsServiceSpy.getPlanetDetails.and.returnValue(of({name: 'Mars'} as PlanetModel));

            // Act
            component.changePageAndUpdateUsers(pageEvent);

            // Assert
            expect(component.currentPage).toBe(2);
            expect(component.isLoading).toBeFalsy();
            expect(userServiceSpy.getUsers).toHaveBeenCalledOnceWith(expectedPageIndex);
            expect(component.totalNumberOfUsers).toEqual(22);
            expect(component.users).toEqual({count: 22, results: [{name: 'Luke Skywalker', homeworld: 'https://swapi.dev/api/planets/1/', homeworldName: 'Mars'}as UserModel] as UserModel[]} as UsersModel);
            expect(component.planetName).toEqual("Mars");
            expect(component.dataSource.data).toEqual([{name: 'Luke Skywalker', homeworld: 'https://swapi.dev/api/planets/1/', homeworldName: 'Mars'}as UserModel] as UserModel[])
        });
    });

    describe('ngOnInit', () => {
        it('should call getUsers and getPlanetDetails, and set expected variables', () => {
            // Arrange
            userServiceSpy.getUsers.and.returnValue(of({count: 22, results: [{name: 'Luke Skywalker', homeworld: 'https://swapi.dev/api/planets/1/', homeworldName: null}as UserModel] as UserModel[]} as UsersModel));
            planetsServiceSpy.getPlanetDetails.and.returnValue(of({name: 'Mars'} as PlanetModel));

            // Act
            component.ngOnInit();

            // Assert
            expect(userServiceSpy.getUsers).toHaveBeenCalledTimes(1);
            expect(planetsServiceSpy.getPlanetDetails).toHaveBeenCalledOnceWith('https://swapi.dev/api/planets/1/')
            expect(component.totalNumberOfUsers).toEqual(22);
            expect(component.users).toEqual({count: 22, results: [{name: 'Luke Skywalker', homeworld: 'https://swapi.dev/api/planets/1/', homeworldName: 'Mars'}as UserModel] as UserModel[]} as UsersModel);
            expect(component.planetName).toEqual("Mars");
            expect(component.dataSource.data).toEqual([{name: 'Luke Skywalker', homeworld: 'https://swapi.dev/api/planets/1/', homeworldName: 'Mars'}as UserModel] as UserModel[])
        });
    });
});