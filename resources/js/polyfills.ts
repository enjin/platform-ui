import process from 'process';
import EventEmitter from 'events';
// @ts-ignore
import * as Buffer from 'rollup-plugin-node-polyfills/polyfills/buffer-es6';

declare global {
    interface Window {
        EventEmitter: typeof EventEmitter;
    }
}

window.process = process;
window.Buffer = Buffer.Buffer;
window.EventEmitter = EventEmitter;
