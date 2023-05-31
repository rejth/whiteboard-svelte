import { on, once } from '../lib/listeners';
import { filter, any, every, sequence, watch, onlyEvent } from '../lib/utils';

export function dndWatcher<T>(target: HTMLElement): AsyncGenerator<T> {
  return watch(() =>
    filter(
      sequence(
        once(target, 'mousedown'),
        every(any(on(window, 'mousemove'), on(window, 'mouseup')), onlyEvent('mousemove')),
      ),
      onlyEvent('mousemove'),
    ),
  );
}
