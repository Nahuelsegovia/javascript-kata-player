import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MdDialog } from '@angular/material';

import { KATA_PLAYER_ANIMATIONS } from './kata-player.animation';
import { LeaveChallengeComponent } from './../dialogs/leave-challenge/leave-challenge.component';
import { KataService, TestExecutorService } from './../core';

import 'codemirror/mode/javascript/javascript';

@Component({
    selector: 'kata-player',
    templateUrl: './kata-player.component.html',
    styleUrls: ['./kata-player.component.scss'],
    animations: KATA_PLAYER_ANIMATIONS
})
export class KataPlayerComponent implements OnInit, OnChanges {

    kataState: string = 'reading';
    leftPaneWidth: number;
    resizingModeEnabled: boolean;
    bodyFunction: string;
    config: any;
    timeSpent: number;
    testResult: Array<String>;
    testResultOutput: string;
    counterDownObs: Subscription;
    attemps: number;
    tests: any;
    numberOfPassedTests: number;
    numberOfTests: number;

    @Input() title: string;
    @Input() explanation: string;
    @Input() examples: Array<string>;
    @Input() inputs: Array<string>;
    @Input() outputs: Array<string>;
    @Input() code: string;
    @Input('next-button') nextButton: boolean;
    @Output() success = new EventEmitter();
    @Output() fail = new EventEmitter();
    @Output() next = new EventEmitter();
    @Output() codeUpdated = new EventEmitter();

    constructor(private kataSrv: KataService, private testExecutorSrv: TestExecutorService, public dialog: MdDialog) {}

    ngOnInit() {
        this.tests = {};
        this.numberOfPassedTests = 0;
        this.numberOfTests = 0;

        this.attemps = 0;
        this.leftPaneWidth = 50;
        this.resizingModeEnabled = false;

        this.config = {
            cursorBlinkRate: 200,
            lineNumbers: true,
            mode: { name: "javascript", json: true },
            tabSize: 2,
            theme: 'material'
        };

        this.timeSpent = 0;
        this.counterDownObs = Observable.timer(0, 1000).subscribe((tick) => {
            this.timeSpent++;
        });
    }

    ngOnChanges() {
        this.timeSpent = 0;
        this.bodyFunction = this.code;
    }

    startExercise() {
        this.kataState = 'writing';
    }

    chronoEvent(evt: any) {
        //console.log('event! ', evt);
    }

    onChange(evt: string) {
        if(typeof(evt) === 'string') {
            this.codeUpdated.emit(evt);
        }
    }

    testKata() {
        this.attemps++;
        if(this.kataState === 'writing') {
            this.testExecutorSrv.checkExerciseCode(this.bodyFunction, this.title).subscribe(
                (result: any) => {
                    this.tests = result;
                    this.numberOfTests = this.tests.output.length;
                    this.numberOfPassedTests = this.tests.output.filter((o: any) => { return o.result }).length;
                    if(this.tests.executionResult) {
                        this.sendKataStats(true);
                        this.success.emit(this.timeSpent);
                    } else {
                        this.sendKataStats(false);
                    }
                }
            );
        }
    }

    sendKataStats(result: boolean) {
        this.kataSrv.sendKataStats({
            kata: this.title,
            status: result,
            attemps: this.attemps,
            time: this.timeSpent
        });
    }

    openOrCloseTestCase(currentStatus: string) {
        if(currentStatus === 'opened') {
            return 'closed';
        } else {
            return 'opened';
        }
    }

    endKata() {
        //this.dialog.open(LeaveChallengeComponent);
        this.fail.emit();
    }

    nextExercise() {
        this.next.emit();
    }

    mousedown(e: any) {

    }

    mousemove(e: any) {

    }

    mouseup(e: any) {

    }

}