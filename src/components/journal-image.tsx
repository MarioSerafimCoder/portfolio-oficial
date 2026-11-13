'use client';

import Image, {type ImageProps} from 'next/image';

/** Limit direct saving gestures to the image without blocking its surrounding link. */
export function JournalImage(props: ImageProps) {
  return <Image
    {...props}
    data-journal-image=""
    draggable={false}
    onContextMenu={event => event.preventDefault()}
    onDragStart={event => event.preventDefault()}
  />;
}
