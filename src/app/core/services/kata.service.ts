import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Kata } from './../models/Kata';

@Injectable()
export class KataService {

    constructor(private httpSrv: Http) { }

    getAllKatas(): Observable<Array<Kata>> {
        return this.httpSrv.get('/api/katas')
            .map((res: Response) => res.json() )
            .catch((err) => Observable.throw(err));
    }

    createKata(kataToBeCreated: Kata): Observable<Kata> {
        return this.httpSrv.post('/api/katas', {})
            .map((res: Response) => res.json())
            .catch((err) => Observable.throw(err));
    }

    sendKataStats(statistics: object): Promise<any> {
        return this.httpSrv.post('/api/katas/stats/register', { stats: statistics }).toPromise();
    }

    getKataStats(): Observable<Array<any>> {
        return this.httpSrv.get('/api/katas/stats')
            .map((res: Response) => res.json())
            .catch((err) => Observable.throw(err));
    }

    getKata(kataId: string): Observable<Kata> {
        return this.httpSrv.get(`/api/katas/kata/${kataId}`)
            .map((res: Response) => res.json())
            .catch((err) => Observable.throw(err));
    }

}
