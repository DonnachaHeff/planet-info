import { UserModel, UsersModel } from './../models/user.model';
import { Subscription } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { PlanetsService } from '../services/planets.service';
import { UsersService } from '../services/users.service';
import { UsersListComponent } from './users-list.component';
import { Sort } from '@angular/material/sort';

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
    });
});