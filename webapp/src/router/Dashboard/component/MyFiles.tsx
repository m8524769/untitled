import React, { useState, useEffect, useContext } from 'react';
import { RpcError } from 'eosjs';
import {
  Skeleton,
  List,
  message,
  Badge,
  Button,
  Space,
  Pagination,
  Tooltip,
} from 'antd';
import { SyncOutlined, TagsOutlined } from '@ant-design/icons';
import { AuthContext } from 'context/AuthContext';
import { CONTRACT_ACCOUNT } from 'constants/eos';
import DownloadFile from './DownloadFile';
import SellFile from './SellFile';
import ModifyFile from './ModifyFile';

const MyFiles: React.FC = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Action Modals
  const [downloadFileVisible, setDownloadFileVisible] = useState(false);
  const [sellFileVisible, setSellFileVisible] = useState(false);
  const [modifyFileVisible, setModifyFileVisible] = useState(false);

  // Props For Modals
  const [fileId, setFileId] = useState();
  const [encryptedCid, setEncryptedCid] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

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
    if (bytes === 0) return 'Unknown';

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
                    <Tooltip
                      title={
                        <div>
                          <TagsOutlined style={{ marginRight: '4px' }} />
                          {file.price}
                        </div>
                      }
                      key="on-sale"
                    >
                      <Badge status="processing" text="On Sale" />
                    </Tooltip>,
                    <a
                      key="modify-file"
                      onClick={() => {
                        setModifyFileVisible(true);
                        setFileId(file.id);
                        setDescription(file.description);
                        setPrice(file.price);
                      }}
                    >
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
                        setDescription(file.description);
                      }}
                    >
                      Sell
                    </a>,
                    <a
                      key="download-file"
                      onClick={() => {
                        setDownloadFileVisible(true);
                        setEncryptedCid(file.encrypted_cid);
                        setDescription(file.description);
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
        description={description}
        onClose={() => {
          setDownloadFileVisible(false);
        }}
      />
      <SellFile
        visible={sellFileVisible}
        fileId={fileId}
        encryptedCid={encryptedCid}
        description={description}
        onClose={() => {
          setSellFileVisible(false);
        }}
      />
      <ModifyFile
        visible={modifyFileVisible}
        fileId={fileId}
        description={description}
        price={price}
        onClose={() => {
          setModifyFileVisible(false);
        }}
      />
    </Skeleton>
  );
};

export default MyFiles;
