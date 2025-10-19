import {
  BaseBoldPlugin,
  BaseItalicPlugin,
  BaseKbdPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin,
} from '@platejs/basic-nodes';
import { BaseFontSizePlugin } from '@platejs/basic-styles';

import { KbdLeafStatic } from '@/components/editor/ui/kbd-node-static';

export const BaseBasicMarksKit = [
  BaseBoldPlugin,
  BaseItalicPlugin,
  BaseUnderlinePlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseKbdPlugin.withComponent(KbdLeafStatic),
  BaseFontSizePlugin,
];
