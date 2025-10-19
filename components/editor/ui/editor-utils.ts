import type { Alignment } from '@platejs/basic-styles';

export type TextAlignment = Alignment | null | undefined;

export function alignmentClass(alignment: TextAlignment) {
  switch (alignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    case 'justify':
      return 'text-justify';
    default:
      return '';
  }
}
