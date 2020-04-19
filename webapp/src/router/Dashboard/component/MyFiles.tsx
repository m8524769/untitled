import React, { useState, useEffect, useContext } from 'react';
import {
  Skeleton,
  List,
  message,
  Badge,
  Button,
  Space,
  Pagination,
} from 'antd';
import { AuthContext } from 'context/AuthContext';
import { RpcError } from 'eosjs';
import { CONTRACT_ACCOUNT } from 'constants/eos';
import DownloadFile from './DownloadFile';
import SellFile from './SellFile';
import { SyncOutlined } from '@ant-design/icons';

const MyFiles: React.FC = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // File Actions Modal
  const [downloadFileVisible, setDownloadFileVisible] = useState(false);
  const [sellFileVisible, setSellFileVisible] = useState(false);
  const [encryptedCid, setEncryptedCid] = useState('');
  const [fileId, setFileId] = useState();

  const { rpc, account } = useContext(AuthContext);

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
      const result = await rpc.get_table_rows({
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
      console.error(e);
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
    <Skeleton active loading={loading} title={false} paragraph={{ rows: 10 }}>
      <List
        itemLayout="horizontal"
        dataSource={files}
        renderItem={(file) => (
          <List.Item
            actions={
              file.for_sale === 1
                ? [
                    <Badge status="processing" text="On Sale" key="on-sale" />,
                    <a key="modify" onClick={() => {}}>
                      Modify
                    </a>,
                  ]
                : [
                    <a
                      key="sell-file"
                      onClick={() => {
                        setSellFileVisible(true);
                        setFileId(file.id);
                        setEncryptedCid(file.encrypted_cid);
                      }}
                    >
                      Sell
                    </a>,
                    <a
                      key="download-file"
                      onClick={() => {
                        setDownloadFileVisible(true);
                        setEncryptedCid(file.encrypted_cid);
                      }}
                    >
                      Download
                    </a>,
                  ]
            }
          >
            <List.Item.Meta
              title={file.description}
              description={`CID Hash: ${file.cid_hash}`}
            />
            <div>Size: {formatBytes(file.size, 1)}</div>
          </List.Item>
        )}
        footer={
          <Space>
            <Button
              icon={<SyncOutlined />}
              loading={loading}
              key="refresh"
              onClick={() => getFiles(account.name)}
            >
              Refresh
            </Button>
            <Pagination defaultCurrent={1} total={20} />
          </Space>
        }
      />
      <DownloadFile
        visible={downloadFileVisible}
        encryptedCid={encryptedCid}
        onClose={() => {
          setDownloadFileVisible(false);
        }}
      />
      <SellFile
        visible={sellFileVisible}
        fileId={fileId}
        encryptedCid={encryptedCid}
        onClose={() => {
          setSellFileVisible(false);
        }}
      />
    </Skeleton>
  );
};

export default MyFiles;
