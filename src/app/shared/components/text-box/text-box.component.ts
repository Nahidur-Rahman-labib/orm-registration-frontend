import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

let nextInputId = 0;

@Component({
    selector: 'app-text-box',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './text-box.component.html',
    styleUrls: ['./text-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextBoxComponent),
            multi: true
        }
    ]
})
export class TextBoxComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() placeholder = '';
    @Input() type: 'text' | 'email' | 'number' | 'tel' | 'password' | 'date' = 'text';

    @Input() required = false;
    @Input() readonly = false;

    @Input() minlength?: number;
    @Input() maxlength?: number;

    @Input() inputMode:
        | 'text'
        | 'numeric'
        | 'decimal'
        | 'email'
        | 'tel'
        | 'search'
        | 'url' = 'text';

    @Input() autocomplete = 'off';

    readonly inputId = `app-text-box-${nextInputId++}`;

    value = '';
    disabled = false;

    private onChange: (value: string) => void = () => { };
    private onTouched: () => void = () => { };

    writeValue(value: string | number | null | undefined): void {
        this.value = value?.toString() ?? '';
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
    }

    handleInput(event: Event): void {
        const input = event.target as HTMLInputElement;

        this.value = input.value;
        this.onChange(this.value);
    }

    handleBlur(): void {
        this.onTouched();
    }
}