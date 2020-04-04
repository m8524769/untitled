import React, { useEffect, useState } from 'react';
import { Typography, PageHeader, Upload } from 'antd';
import { InboxOutlined, CheckCircleOutlined } from '@ant-design/icons';
import IPFS from 'ipfs';

const IpfsUpload: React.FC = () => {
  const [cid, setCid] = useState('');
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    // const createIpfsNode = async () => {
    //   const node = await IPFS.create({ repo: String(Math.random() + Date.now()) })
    //   const { id, agentVersion, protocolVersion } = await node.id()
    //   console.log(id, agentVersion, protocolVersion);
    //   for await (const { cid } of node.add("123")) {
    //     console.log(cid.toString());
    //     let bufs = [];
    //     for await (const buf of node.cat(cid)) {
    //       bufs.push(buf);
    //     }
    //     const data = Buffer.concat(bufs);
    //     console.log(data.toString('utf8'));
    //   }
    // }
    // createIpfsNode();
  });

  const upload = async (file: any) => {
    const node = await IPFS.create({
      repo: String(Math.random() + Date.now()),
    });
    console.log('IPFS node is ready');
    for await (const { cid } of node.add(file)) {
      return cid.toString();
    }
  };

  return (
    <PageHeader title="IPFS Upload">
      <Upload.Dragger
        fileList={fileList}
        customRequest={(options) => {
          console.log(options);
          upload(options.file)
            .then((cid) => {
              setCid(cid);
              options.onSuccess(cid, options.file); // Return CID as response
            })
            .catch((error) => options.onError(error));
        }}
        onChange={(info) => {
          let fileList = [...info.fileList];
          if (fileList.length === 0) {
            setCid('');
          }
          fileList = fileList.slice(-1); // Only one file
          fileList = fileList.map((file) => {
            if (file.response) {
              // Got CID
              file.url = `https://ipfs.io/ipfs/${file.response}`; // Download link
            }
            return file;
          });
          setFileList(fileList);
        }}
        showUploadList={{
          showDownloadIcon: true,
        }}
      >
        {cid === '' ? (
          <div>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Upload File to IPFS</p>
            <p className="ant-upload-hint">
              This operation will NOT publish your file
            </p>
          </div>
        ) : (
          <div>
            <p className="ant-upload-drag-icon">
              <CheckCircleOutlined />
            </p>
            <p className="ant-upload-text">Upload Successfully!</p>
            <p className="ant-upload-hint">You can copy the file's CID below</p>
          </div>
        )}
      </Upload.Dragger>

      {cid !== '' && (
        <div>
          <Typography.Text strong>CID: </Typography.Text>
          <Typography.Text code copyable>
            {cid}
          </Typography.Text>
        </div>
      )}
    </PageHeader>
  );
};

export default IpfsUpload;
