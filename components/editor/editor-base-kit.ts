import { BaseBasicBlocksKit } from '@/components/editor/plugins/basic-blocks-base-kit';
import { BaseBasicMarksKit } from '@/components/editor/plugins/basic-marks-base-kit';
import { BaseLineHeightKit } from '@/components/editor/plugins/line-height-base-kit';

export const BaseEditorKit = [
  ...BaseBasicBlocksKit,
  ...BaseBasicMarksKit,
  ...BaseLineHeightKit,
];
