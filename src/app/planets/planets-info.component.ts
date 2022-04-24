import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'planet-info',
    templateUrl: './planets-info.component.html'
})
export class PlanetInfoComponent {
    constructor(
        public dialogRef: MatDialogRef<PlanetInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ){
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}