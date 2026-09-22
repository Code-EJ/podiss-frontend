import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { notifications } from '../feedback/notifications';
// jsdom has no native top-layer dialog implementation. Browser checks remain necessary.
HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); this.querySelector<HTMLElement>('button')?.focus(); };
HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
afterEach(() => { cleanup(); notifications.clear(); localStorage.clear(); sessionStorage.clear(); });
