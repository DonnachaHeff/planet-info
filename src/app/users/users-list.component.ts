import { UsersModel } from './../models/user.model';
import { UsersService } from './../services/users.service';
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { Observable } from 'rxjs/internal/Observable';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PlanetInfoComponent } from '../planets/planets-info.component';
import { PlanetsService } from '../services/planets.service';

@Component({
    selector: 'users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
    constructor(
        private userService: UsersService,
        private planetsService: PlanetsService,
        private matDialog: MatDialog,
    ){}
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns = ['name', 'height', 'mass', 'created', 'edited', 'homeworld'];
    users: UsersModel;
    dataSource: any;

    ngOnInit(): void {
        this.getUsers().subscribe(() => {
            this.dataSource = new MatTableDataSource(this.users.results);
            this.dataSource.sort = this.sort;
        });
    }

    getUsers(): Observable<UsersModel> {
        return this.userService.getUsers().pipe(
            tap(users => {
                this.users = users;
            })
        );
    }

    displayPlanetDetails(homeworld: string): void {
        this.planetsService.getPlanetDetails(homeworld).subscribe((homeworldDetails) => {
            this.matDialog.open(PlanetInfoComponent, {
                data: homeworldDetails,
            });
        });
    }

    applyFilter(filterValue: any): void {
        filterValue = filterValue.value.trim(); 
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }
}