import {
    ChangeDetectionStrategy,
    Component,
    input,
    output
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './generic-button.component.html',
    styleUrls: ['./generic-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericButtonComponent {
    readonly label = input<string>('');
    readonly icon = input<string>('');
    readonly variant = input<'primary' | 'danger' | 'ghost'>('primary');
    readonly size = input<'sm' | 'md'>('md');
    readonly enable = input<boolean>(true);
    readonly visible = input<boolean>(true);
    readonly loading = input<boolean>(false);
    readonly value = input<string>('');
    readonly cssClass = input<string>('');

    readonly onClick = output<MouseEvent>();
    readonly valueChanged = output<string>();

    get isDisabled(): boolean {
        return !this.enable() || this.loading();
    }

    onButtonClick(event: MouseEvent): void {
        if (!this.isDisabled) {
            this.onClick.emit(event);
            this.valueChanged.emit(this.value());
        }
    }
}