'use client';

import type {ImageLoaderProps} from 'next/image';

export default function imageLoader({src,width}:ImageLoaderProps) {
  if(!/^\/media\/.+\.(webp|png|jpe?g)$/i.test(src)||src.includes('..')||src.startsWith('/media/responsive/'))return src;
  return `/media/responsive/${src.slice('/media/'.length)}/${width}.webp`;
}
