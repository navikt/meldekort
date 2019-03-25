import { from } from 'rxjs';
import { FetchState, FetchStatus } from '../types/fetch';

/**
 * Use async functions with rxjs, with less parenthesis soup.
 *
 * @example
 *
 * // with fromAsync:
 * fromAsync(async () => {
 *     ... async code...
 * }).pipe(
 *     ... rxjs operators ...
 * )
 *
 * // without fromAsync:
 * from(
 *     (async () => {
 *         ... async code ...
 *     })()).pipe(
 *         ... rxjs operators ...
 * )
 */
export function fromAsync<R>(asyncFn: () => Promise<R>) {
    return from(asyncFn());
}