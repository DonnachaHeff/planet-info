import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
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
});