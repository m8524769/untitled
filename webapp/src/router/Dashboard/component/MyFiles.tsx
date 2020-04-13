import React, { useState, useEffect, useContext } from 'react';
import { Skeleton, List, message, Badge } from 'antd';
import { AuthContext } from 'context/AuthContext';
import { RpcError } from 'eosjs';
import Api from 'api';
import { CONTRACT_ACCOUNT } from 'constants/eos';
import DownloadFile from './DownloadFile';

const MyFiles: React.FC = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Download File Modal
  const [downloadFileVisible, setDownloadFileVisible] = useState(false);
  const [encryptedCid, setEncryptedCid] = useState('');
  const [cidHash, setCidHash] = useState('');

  const { account } = useContext(AuthContext);

  useEffect(() => {
    if (account.name) {
      getFiles(account.name);
    } else {
      setLoading(true);
      setFiles([]);
    }
  }, [account]);

  const getFiles = async (account: string) => {
    setLoading(true);
    try {
      const result = await Api.eos.rpc.get_table_rows({
        json: true,
        code: CONTRACT_ACCOUNT,
        scope: CONTRACT_ACCOUNT,
        table: 'files',
        index_position: 2,
        lower_bound: account,
        upper_bound: account,
        key_type: 'i64',
        reverse: true,
      });
      console.log('My Files:', result.rows);
      setFiles(result.rows);
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      }
    }
    setLoading(false);
  };

  const formatBytes = (bytes, decimals) => {
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <List
      loading={loading}
      itemLayout="horizontal"
      // loadMore={loadMore}
      dataSource={files}
      renderItem={(file) => (
        <List.Item
          actions={
            file.for_sale === 1
              ? [
                  <Badge status="processing" text="On Sale" />,
                  <a key="modify" onClick={() => {}}>
                    Modify
                  </a>,
                ]
              : [
                  <a key="sell" onClick={() => {}}>
                    Sell
                  </a>,
                  <a
                    key="download"
                    onClick={() => {
                      setDownloadFileVisible(true);
                      setEncryptedCid(file.encrypted_cid);
                      setCidHash(file.cid_hash);
                    }}
                  >
                    Download
                  </a>,
                ]
          }
        >
          <Skeleton title={false} loading={file.loading} active>
            <List.Item.Meta
              title={file.description}
              description={`CID Hash: ${file.cid_hash}`}
            />
            <div>Size: {formatBytes(file.size, 1)}</div>
          </Skeleton>
        </List.Item>
      )}
      footer={
        <DownloadFile
          visible={downloadFileVisible}
          encryptedCid={encryptedCid}
          cidHash={cidHash}
          onConfirm={() => {
            setDownloadFileVisible(false);
          }}
          onCancel={() => {
            setDownloadFileVisible(false);
          }}
        />
      }
    />
  );
};

export default MyFiles;
