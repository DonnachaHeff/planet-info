import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { map, merge, retry, shareReplay } from 'rxjs';
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
            this.dataSource = new MatTableDataSource(this.users?.results);
            this.dataSource.sort = this.sort;
        }, (error) => {
            console.log("Failed to get Users Details: " + error);
        });
    }

    getUsers() {
        return merge(this.userService.getUsers().pipe(retry(3), map(res => {
                    this.users = res;
                    this.totalNumberOfUsers = res.count;
                    return res;
        }), shareReplay(1)))
        .pipe(map(res => {
            res.results.forEach(x => {
                this.getPlanetName(x.homeworld).subscribe(() => {
                    x.homeworldName = this.planetName;
                });
            });
        }), shareReplay(1));
    }

    displayPlanetDetails(homeworld: string): void {
        this.planetsService.getPlanetDetails(homeworld).subscribe((homeworldDetails) => {
            this.matDialog.open(PlanetInfoComponent, {
                data: homeworldDetails,
            });
        });
    }

    getPlanetName(homeworldUrl: string) {
        return this.planetsService.getPlanetDetails(homeworldUrl).pipe(retry(3), map(result => {
            this.planetName = result.name;
        }), shareReplay(1));
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
                }, (error) => {
                    console.log("Getting Planet Name Failed: " + error);
                    
                }), shareReplay(1);
            }), shareReplay(1);

            this.dataSource = new MatTableDataSource(this.users.results);
            this.dataSource.sort = this.sort;

            this.isLoading = false;
        }, (error) => {
            console.log("Getting User Details Failed" + error);
        });
    }
}