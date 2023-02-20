import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { confetti, ConfettiOptions } from 'tsparticles-confetti';
import type { Container } from 'tsparticles-engine';

@Component({
    selector: 'ng-confetti',
    template: '<div [id]="id"></div>',
})
export class NgConfettiComponent implements AfterViewInit {
    @Input() options?: ConfettiOptions;
    @Input() id: string;

    private container?: Container;
    private destroy$ = new Subject<void>();

    constructor(@Inject(PLATFORM_ID) protected platformId: string) {
        this.id = 'tsparticles';
    }

    public ngAfterViewInit(): void {
        if (isPlatformServer(this.platformId)) {
            return;
        }

        console.log('ciao');

        (async () => {
            this.container = await confetti(this.id, this.options);
        })();
    }

    public ngOnDestroy(): void {
        this.container?.destroy();
        this.destroy$.next();
    }
}
