import { on, once } from '../lib/listeners';
import { filter, any, every, sequence, watch, onlyEvent } from '../lib/utils';

export function resizeWatcher<T>(target: HTMLElement): AsyncGenerator<T> {
  return watch(() =>
    filter(
      sequence(
        once(target, 'mousedown'),
        every(
          any(on(document, 'mousemove'), on(document, 'mouseup')),
          onlyEvent('mousemove')
        )
      ),
      onlyEvent('mousemove')
    )
  );
}
