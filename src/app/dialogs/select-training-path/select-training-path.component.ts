import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { TrainingService, TrainingPath } from './../../core';

@Component({
    templateUrl: './select-training-path.component.html',
    styleUrls: ['./select-training-path.component.scss']
})
export class SelectTrainingPathDialog implements OnInit {

    private showError: boolean;
    private selected: TrainingPath;
    private selectedValue: string;
    private trainingPaths: Array<TrainingPath>;

    constructor(private dialogRef: MdDialogRef<SelectTrainingPathDialog>, 
        private router: Router,
        private trainingSrv: TrainingService) {}

    ngOnInit() {
        this.showError = false;
        this.trainingSrv.getTrainingPaths().subscribe(
            (metadata) => { this.trainingPaths = metadata; }
        );
    }

    startPath() {
        if(this.selectedValue) {
            this.router.navigate(['/training', this.selectedValue]);
            this.dialogRef.close();
        } else {
            this.showError = true;
        }
    }

    onSelectedChange(e) {
        let selected: Array<TrainingPath> = this.trainingPaths.filter(
            (path: TrainingPath) => { return (path.topic === e.value); }
        );

        if(selected[0]) {
            this.selected = selected[0];
            this.selectedValue = selected[0].topic;
            this.showError = false;
        } else {
            this.selectedValue = null;
            this.showError = true;
        }
    }

}