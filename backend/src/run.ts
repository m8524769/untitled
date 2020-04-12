import { BaseActionWatcher } from 'demux';
import { NodeosActionReader } from 'demux-eos';
import * as demuxConfig from '../config/demuxConfig.json';
import handlerVersions from './handlerVersions';
import ActionHandler from './ActionHandler';

// An async init is created and then called to allow for `await`ing the setup code
const init = async () => {
  const actionReader = new NodeosActionReader({
    nodeosEndpoint: demuxConfig.nodeosEndpoint, // the endpoint for the nodeos RPC api
    startAtBlock: demuxConfig.startAtBlock, // The block to begin indexing at. For values less than 1, this switches to a "tail" mode, where we start at an offset of the most recent blocks.
    onlyIrreversible: demuxConfig.onlyIrreversible, // if true, only blocks that have already reached irreversibility will be handled
  });

  const actionHandler = new ActionHandler(handlerVersions);

  const actionWatcher = new BaseActionWatcher(
    actionReader,
    actionHandler,
    demuxConfig.pollInterval,
  );

  await actionWatcher.watch();
  console.info(`Demux listening on ${demuxConfig.nodeosEndpoint}...`);
};

init();
