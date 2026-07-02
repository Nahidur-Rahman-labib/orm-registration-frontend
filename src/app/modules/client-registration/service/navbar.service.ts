import { Injectable, signal } from '@angular/core';

export interface NavbarConfig {
    pageTitle: string;
    showActions: boolean;
}

@Injectable({ providedIn: 'root' })
export class NavbarService {
    private config = signal<NavbarConfig>({
        pageTitle: '',
        showActions: false
    });

    readonly pageTitle = () => this.config().pageTitle;
    readonly showActions = () => this.config().showActions;

    // Action callbacks registered by the current page
    private _onSave?: () => void;
    private _onReset?: () => void;
    private _onView?: () => void;
    private _onExit?: () => void;

    setPage(config: NavbarConfig): void {
        this.config.set(config);
    }

    registerActions(actions: {
        onSave?: () => void;
        onReset?: () => void;
        onView?: () => void;
        onExit?: () => void;
    }): void {
        this._onSave = actions.onSave;
        this._onReset = actions.onReset;
        this._onView = actions.onView;
        this._onExit = actions.onExit;
    }

    clearActions(): void {
        this._onSave = this._onReset = this._onView = this._onExit = undefined;
        this.config.set({ pageTitle: '', showActions: false });
    }

    triggerSave(): void { this._onSave?.(); }
    triggerReset(): void { this._onReset?.(); }
    triggerView(): void { this._onView?.(); }
    triggerExit(): void { this._onExit?.(); }
}