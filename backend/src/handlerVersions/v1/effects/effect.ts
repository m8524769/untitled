/**
 * This is an example Effect. Use Effects for executing non-deterministic mutative actions. They are run asynchronously,
 * and may be run concurrently with other effects. Make sure to export one (and only one) Effect object from this file.
 */

import { Effect, Block, StatelessActionCallback } from 'demux';
import fs from 'fs';
import NodeRSA from 'node-rsa';
import Api from '../../../api';
import * as eosConfig from '../../../../config/eosConfig.json';

const findFileById = async (fileId: number) => {
  return await Api.eos.rpc.get_table_rows({
    json: true,
    code: eosConfig.contract,
    scope: eosConfig.contract,
    table: 'files',
    lower_bound: fileId,
    limit: 1,
  }).then(result => result.rows[0]);
};

const findRsaKeyByAccount = async (account: string) => {
  return await Api.eos.rpc.get_table_rows({
    json: true,
    code: eosConfig.contract,
    scope: account,
    table: 'rsa.keys',
    limit: 1,
  }).then(result => {
    if (result.rows.length !== 0) {
      return result.rows[0].public_key;
    } else {
      throw new Error(`Cannot find RSA public key on ${account}`);
    }
  });
};

const updateEncryptedCid = async (fileId: number, encryptedCid: string) => {
  return await Api.eos.transact({
    actions: [{
      account: eosConfig.contract,
      name: 'updatecid',
      authorization: [{
        actor: eosConfig.contract,
        permission: 'active',
      }],
      data: {
        file_id: fileId,
        encrypted_cid: encryptedCid,
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
};

const run: StatelessActionCallback = async (payload: any, block: Block, context: any) => {
  console.log(payload, block);
  if (payload.data.to !== eosConfig.contract) {
    return;
  }

  const fileId: number = parseInt(payload.data.memo, 10);
  console.log('file_id:', fileId);

  // Find file data by file_id
  const fileInfo = await findFileById(fileId);
  console.log('fileInfo:', fileInfo);

  // Decrypt encrypted_cid with RSA private_key
  const privateKey = fs.readFileSync('./.rsa/private_key', 'utf-8');
  const key = new NodeRSA(privateKey);
  const cid = key.decrypt(fileInfo.encrypted_cid, 'utf8');
  console.log('Original CID:');
  console.log(cid);

  // Find public_key by new owner
  const ownerPublicKey = await findRsaKeyByAccount(fileInfo.owner);
  console.log('Owner\'s RSA public key:');
  console.log(ownerPublicKey);

  // Encrypt cid with owner's RSA public key
  key.importKey(ownerPublicKey);
  const newEncryptedCid = key.encrypt(cid, 'base64');
  console.log('New encrypted_cid:');
  console.log(newEncryptedCid);

  // Update encrypted_cid
  await updateEncryptedCid(fileId, newEncryptedCid);
};

const effect: Effect = {
  run,
  actionType: 'eosio.token::transfer', // The actionType this effect will subscribe to
  deferUntilIrreversible: true, // If true, the effect will only run after the action becomes irreversible
};

export default effect;
