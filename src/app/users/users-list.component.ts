import { PageEvent } from '@angular/material/paginator';
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { map, merge, retry, shareReplay, Observable, Subscription } from 'rxjs';
import { UsersModel, UserModel } from './../models/user.model';
import { UsersService } from './../services/users.service';
import { PlanetInfoComponent } from '../planets/planets-info.component';
import { PlanetsService } from '../services/planets.service';

@Component({
    selector: 'users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {
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

    private readonly subscription = new Subscription();

    ngOnInit(): void {
        this.subscription.add(
        this.getUsers().subscribe(() => {
            this.dataSource = new MatTableDataSource(this.users?.results);
        }, (error) => {
            console.log("Failed to get Users Details: " + error);
        }));
    }

    displayPlanetDetails(homeworld: string): void {
        this.subscription.add(
        this.planetsService.getPlanetDetails(homeworld).subscribe((homeworldDetails) => {
            this.matDialog.open(PlanetInfoComponent, {
                data: homeworldDetails,
            });
        }));
    }

    applyFilter(filterValue: any): void {
        this.filterValue = filterValue.value.trim().toLowerCase();

        // filters only by name
        const users = this.users.results.filter(x => x.name.toLowerCase().includes(this.filterValue))
        this.dataSource.data = users;
    }

    changePageAndUpdateUsers(pageEvent: PageEvent): void {
        // reset filter on page change
        this.filterValue = '';

        this.currentPage = pageEvent.pageIndex+1;
        this.isLoading = true;

        this.getUsers(this.currentPage).subscribe(() => {
            this.dataSource = new MatTableDataSource(this.users?.results);
            this.isLoading = false;
        }, (error) => {
            console.log("Failed to get Users Details: " + error);
            this.isLoading = false;
        });
    }

    sortData(sort: Sort): void {
        if (!sort.active || sort.direction === '') {
            return;
        }

        this.dataSource.data = this.dataSource.data.sort((a, b) => {
            let isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'name': return this.compare(a.name, b.name, isAsc);
                case 'height': return this.compare(+a.height, +b.height, isAsc);
                case 'mass': return this.compare(+a.mass, +b.mass, isAsc);
                case 'created': return this.compare(new Date(a.created).getTime(), new Date(b.created).getTime(), isAsc);
                case 'edited': return this.compare(new Date(a.edited).getTime(), new Date(b.edited).getTime(), isAsc);
                case 'homeworldName': return this.compare(a.homeworldName, b.homeworldName, isAsc);
                default: return 0;
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private getUsers(currentPage?: number): Observable<void> {
            return merge(
                this.userService.getUsers(currentPage).pipe(
                    shareReplay(10),
                    retry(3), 
                    map(result => {
                        this.users = result;
                        this.totalNumberOfUsers = result.count;
                        return result;
            })))
            .pipe(map(res => {
                res.results.forEach(x => {
                    this.subscription.add(
                    this.getPlanetName(x.homeworld).subscribe(() => {
                        x.homeworldName = this.planetName;
                    }));
                });
            }));
    }

    private getPlanetName(homeworldUrl: string): Observable<void> {
        return this.planetsService.getPlanetDetails(homeworldUrl).pipe(
            shareReplay(20),
            retry(3),
            map(result => {
            this.planetName = result.name;
        }));
    }

    private compare(a: string | number | Date, b: string | number | Date, isAsc: boolean): number {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }    
}