import { isPlatformServer } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { ConfettiOptions, fireworks } from 'tsparticles-fireworks';

@Component({
    selector: 'ng-fireworks',
    template: `<div [id]="id"></div>`,
    styles: [],
})
export class NgFireworksComponent {
    @Input() options?: ConfettiOptions;
    @Input() id: string;

    constructor(@Inject(PLATFORM_ID) protected platformId: string) {
        this.id = 'tsparticles';
    }

    public ngAfterViewInit(): void {
        if (isPlatformServer(this.platformId)) {
            return;
        }

        fireworks(this.id, this.options);
    }
}
