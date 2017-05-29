export * from './node-visual/node-visual.component';
export * from './link-visual/link-visual.component';

import { NodeVisualComponent, ExpandDialog } from './node-visual/node-visual.component';
import { LinkVisualComponent } from './link-visual/link-visual.component';
import { ParentVisualComponent } from './parent-visual/parent-visual.component';
export const SHARED_VISUALS = [
    NodeVisualComponent,
    LinkVisualComponent,
    ParentVisualComponent,
    ExpandDialog
];
