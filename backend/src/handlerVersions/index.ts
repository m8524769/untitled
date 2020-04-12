/**
 * This exports an array of HandlerVersions, to be consumed by your chosen ActionHandler implementation.
 *
 * This file is automatically updated by the `demux generate handlerVersion [ version name ]` command.
 */

import { HandlerVersion } from 'demux'
import v1 from './v1'

const handlerVersions: HandlerVersion[] = [
  v1,
];

export default handlerVersions;
