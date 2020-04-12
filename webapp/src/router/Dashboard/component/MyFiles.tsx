import React from 'react';
// import { Skeleton, List, message } from 'antd';
// import { AuthContext } from 'context/AuthContext';
// import { RpcError } from 'eosjs';
// import Api from 'api';
// import { CONTRACT_ACCOUNT } from 'constants/eos';

const MyFiles: React.FC = () => {
  // const [files, setFiles] = useState([]);
  // const [loading, setLoading] = useState(true);

  // const { account } = useContext(AuthContext);

  // useEffect(() => {
  //   if (account.name) {
  //     getFiles(account.name);
  //   } else {
  //     setLoading(true);
  //     setFiles([]);
  //   }
  // }, [account]);

  // const getFiles = async (account: string) => {
  //   setLoading(true);
  //   try {
  //     const result = await Api.eos.rpc.get_table_rows({
  //       json: true,
  //       code: CONTRACT_ACCOUNT,
  //       scope: account, // Account that owns the data
  //       table: 'files',
  //       limit: 10,
  //       reverse: true,
  //     });
  //     console.log(result);
  //     setFiles(result);
  //   } catch (e) {
  //     if (e instanceof RpcError) {
  //       message.error(JSON.stringify(e.json, null, 2));
  //     }
  //   }
  //   setLoading(false);
  // };

  return (
    <div></div>
    // <List
    //   loading={initLoading}
    //   itemLayout="horizontal"
    //   loadMore={loadMore}
    //   dataSource={list}
    //   renderItem={item => (
    //     <List.Item
    //       actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
    //     >
    //       <Skeleton title={false} loading={item.loading} active>
    //         <List.Item.Meta
    //           title={<a href="https://ant.design">{item.name.last}</a>}
    //           description="Ant Design, a design language for background applications, is refined by Ant UED Team"
    //         />
    //         <div>content</div>
    //       </Skeleton>
    //     </List.Item>
    //   )}
    // />
  );
};

export default MyFiles;
