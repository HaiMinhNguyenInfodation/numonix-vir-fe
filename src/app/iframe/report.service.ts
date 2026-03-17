import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {
    private reportUrlSubject = new BehaviorSubject<string | null>(null);
    reportUrl$ = this.reportUrlSubject.asObservable();

    setReportUrl(url: string): void {
        this.reportUrlSubject.next(url);
    }

    clearReportUrl(): void {
        this.reportUrlSubject.next(null);
    }
}
