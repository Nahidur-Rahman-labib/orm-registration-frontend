import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextDateId = 0;

@Component({
    selector: 'app-date-picker',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DatePickerComponent),
        multi: true
    }]
})
export class DatePickerComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() required = false;
    @Input() min = '';   // e.g. '1900-01-01'
    @Input() max = '';   // e.g. today's date for DOB

    readonly inputId = `app-date-picker-${nextDateId++}`;
    value = '';
    disabled = false;

    private onChange: (value: string) => void = () => { };
    private onTouched: () => void = () => { };

    constructor(private cdr: ChangeDetectorRef) { }

    writeValue(val: string | null | undefined): void {
        this.value = val ?? '';
        this.cdr.markForCheck();
    }

    registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
        this.cdr.markForCheck();
    }

    handleInput(event: Event): void {
        this.value = (event.target as HTMLInputElement).value;
        this.onChange(this.value);
    }

    handleBlur(): void { this.onTouched(); }
}