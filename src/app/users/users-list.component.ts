import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { map, merge, retry, shareReplay } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
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
    filterValue: string = '';

    ngOnInit(): void {
        this.getUsers().subscribe(() => {
            this.dataSource = new MatTableDataSource(this.users?.results);
        }, (error) => {
            console.log("Failed to get Users Details: " + error);
        });
    }

    getUsers(): Observable<void> {
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

    getPlanetName(homeworldUrl: string): Observable<void> {
        return this.planetsService.getPlanetDetails(homeworldUrl).pipe(retry(3), map(result => {
            this.planetName = result.name;
        }), shareReplay(1));
    }

    applyFilter(filterValue: any): void {
        this.filterValue = filterValue.value.trim().toLowerCase();

        // filters only by name
        const users = this.users.results.filter(x => x.name.toLowerCase().includes(this.filterValue))
        this.dataSource.data = users;
    }

    changePage(pageEvent: any): void {
        // reset filter on page change
        this.filterValue = '';

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

            this.isLoading = false;
        }, (error) => {
            console.log("Getting User Details Failed" + error);
        });
    }

    sortData(sort: Sort): void {
        if (!sort.active || sort.direction == '') {
            return;
        }

        this.dataSource.data = this.dataSource.data.sort((a, b) => {
            let isAsc = sort.direction == 'asc';
            switch (sort.active) {
                case 'name': return this.compare(a.name, b.name, isAsc);
                case 'height': return this.compare(+a.height, +b.height, isAsc);
                case 'mass': return this.compare(+a.mass, +b.mass, isAsc);
                case 'created': return this.compare(new Date(+a.created), new Date(+b.created), isAsc);
                case 'edited': return this.compare(new Date(+a.edited), new Date(+b.edited), isAsc);
                case 'homeworldName': return this.compare(+a.homeworldName, +b.homeworldName, isAsc); // bug - not sorting
                default: return 0;
            }
        });
    }

    private compare(a: string | number | Date, b: string | number | Date, isAsc: boolean): number {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }    
}