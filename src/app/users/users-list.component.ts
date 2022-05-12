import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { tap, map } from 'rxjs';
import { UsersModel, UserModel } from './../models/user.model';
import { UsersService } from './../services/users.service';
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

    displayedColumns = ['name', 'height', 'mass', 'created', 'edited', 'homeworldName'];
    users: UsersModel;
    dataSource: any;
    planetName: string;
    nextUsers: UserModel[];
    currentPage: number;
    totalNumberOfUsers: number;
    isLoading = false;

    ngOnInit(): void {
        this.getUsers().subscribe(() => {
            this.users.results.forEach(user => {
                this.getPlanetName(user.homeworld).subscribe(() => {
                    user.homeworldName = this.planetName;
                });
            });

            this.dataSource = new MatTableDataSource(this.users.results);
            this.dataSource.sort = this.sort;
        });
    }

    getUsers() {
        return this.userService.getUsers().pipe(
            tap(users => {
                this.users = users;
                this.totalNumberOfUsers = users.count;
            }, error => {
                console.log(error);
            })
        )
    }

    displayPlanetDetails(homeworld: string): void {
        this.planetsService.getPlanetDetails(homeworld).subscribe((homeworldDetails) => {
            this.matDialog.open(PlanetInfoComponent, {
                data: homeworldDetails,
            });
        });
    }

    getPlanetName(homeworldUrl: string) {
        return this.planetsService.getPlanetDetails(homeworldUrl).pipe(map(result => {
            this.planetName = result.name;
        }));
    }

    applyFilter(filterValue: any): void {
        filterValue = filterValue.value.trim(); 
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    changePage(pageEvent: any) {
        this.currentPage = pageEvent.pageIndex+1;
        this.isLoading = true;

        this.userService.getUsers(this.currentPage).subscribe((users) => {
            this.users = users;
            this.users.results.forEach(user => {
                this.getPlanetName(user.homeworld).subscribe(() => {
                    user.homeworldName = this.planetName;
                });
            });

            this.dataSource = new MatTableDataSource(this.users.results);
            this.dataSource.sort = this.sort;
            this.isLoading = false;
        });
    }
}