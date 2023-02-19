import { isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  PLATFORM_ID,
} from '@angular/core';
import { confetti, ConfettiOptions } from 'tsparticles-confetti';

@Component({
  selector: 'ng-confetti',
  template: '<div [id]="id"></div>',
})
export class NgConfettiComponent implements AfterViewInit {
  @Input() options?: ConfettiOptions;
  @Input() id: string;

  constructor(@Inject(PLATFORM_ID) protected platformId: string) {
    this.id = 'tsparticles';
  }

  public ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    confetti(this.id, this.options);
  }
}
