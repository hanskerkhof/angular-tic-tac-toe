import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export abstract class BaseComponent implements OnDestroy {
    public destroyer$: Subject<void> = new Subject();

    public ngOnDestroy() {
        this.destroyer$.next();
        this.destroyer$.complete();
    }
}
