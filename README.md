# UNTITLED (WIP)

## 运行说明

- 前端

1. 本地节点的话将 `chainId` 填写至 `webapp/src/constants/eos.ts` 中的 `LOCAL` 项；
2. 可在 `webapp/src/constants/eos.ts` 的最后一行切换测试网络；

```bash
cd ./webapp
yarn
yarn start
```

- 后端

1. 将合约账户的EOS私钥填写至 `backend/config/eosConfig.json`；

```bash
cd ./backend
npm i
npm start
```

- 智能合约
1. 部署后需为合约账户添加 `eosio.code` 权限；
2. 部署 `eosio.token` 后发行代币 ASS，精度为4，并全数转移至合约账户；
3. 使用 `setkey` 设置合约的 RSA 公钥。

## 交易流程

### 前提条件

所有用户都需要拥有自己的 EOS 账户，否则无法使用该平台，登录方式目前支持 Scatter 和 Anchor，用户需自行下载相应钱包应用并连接到自己的账户。进入该平台后，页面将主动弹窗询问 Scatter 的授权，成功授权后前端会记住你的账户，直到你手动注销。

> 注：Scatter Desktop 建议下载 11.0.1 版本的，新版有时会出一堆莫名其妙的bug。

### 消费者视角：

在首次购买文件之前，用户必须先在平台上生成一次 RSA 公私钥对，并将公钥上传，与账户绑定，私钥则用于解密购买到的文件 CID。用户需将私钥妥善保管，否则你买到的只会是一堆乱码。

消费者在平台上购买文件共有两种方式，具体如下：

1. 直接向合约账户转账，并在 `memo` 中填写文件对应的 ID。

该方式存在一定风险，合约中规定转账金额必须大于等于文件售价，并且不设找零，所以在价格波动的情况下，该方式会导致两种风险的产生：一是交易前价格上涨导致交易失败，二是价格下跌导致多花冤枉钱。另外，由于填写转账信息需要时间，所以在此期间你要买的文件很有可能会被其他购买者抢走。

**注意：不要直接向卖家转账，直接转的话是不会被该合约监听到的，相当于你的钱白花了。**

每个文件 CID 都需要对应的 RSA 私钥进行解密，否则该 CID 将不可读且不可再次售卖，如用户遗失私钥但知道原始的 CID，那么可在平台上使用该 CID 进行哈希验证，如验证通过，则可用新的公钥对其重新加密。

> 注：平台默认不会保留你的 RSA 私钥，这意味着你每次下载文件都需要导入对应的私钥，如果是你自己的电脑，可以选择在浏览器内保存一个默认的私钥，避免重复操作（平台不会上传你的 RSA 私钥）

2. 先下订单再转账。

下单操作可以帮助你快速锁定价格，后续付款只需要按照订单价格来支付就行了，但代价是你需要为额外的 RAM 消耗买单，该方式的另一个优势是：如果存在多位买家同时抢购同一文件的情况下，合约会默认选择已下订单的用户完成交易。

用户成功下单后，该订单将永久生效，不会过期，用户可在随后的任意时间点付款。但为了防止恶意下单导致文件被锁定的情况，每个订单都将被赋予一个安全期限（默认为 15 分钟），如过了安全期限仍未付款，则该订单将有可能随时被同类订单覆盖。

***

交易成功后，文件将自动解除售卖状态（避免刚买到手又被人买走了），用户可在此期间下载文件或修改其相关信息，如果用户愿意的话，可将该文件以不同的定价再次上架售卖。

### 卖家视角：

卖家将文件上架售卖一共需要做如下几步：

1. 将文件上传至 IPFS，并获取返回的 CID。

用户可自行下载 IPFS Desktop，然后启动本地节点并上传文件，如果嫌麻烦的话，平台本身也提供了上传文件的小工具，用户可直接前往 Dashboard 进行上传操作。以 Dashboard 中的 IPFS Upload 工具为例，上传成功后，用户可在下方找到该文件对应的 CID，注意：任何人都可以通过该 CID 下载其对应的文件，请妥善保管。

2. 发布文件。

用户可在 Publish File 表单中填写文件的相关信息，包括 CID、描述、售价等等，填写完成后点击发布即可。需要注意的是，如果 IPFS 上已存在该文件（即 CID 重合），那么该操作将不被允许。

3. 等着收钱。

当有人买你的文件时，你会收到合约账户给你转发的代币，代币数量与买家支付的数量完全相等，不用交税。收入的交易记录会有一个固定的 `memo`，内容为 `"income"`。

***

卖家需确保上架的文件 CID 是由合约的 RSA 公钥正确加密的，否则会被第一时间检测到并强制下架。（普通用户并不需要担心这个问题，除非你执意要用命令行操作）

对于卖家而言，整个交易流程是不需要人为介入的，也就是说，要是卖家突然发现自己的余额上去了，或者自己上架的文件突然消失了，就说明交易完成了，卖家可在 Recent Transactions 窗口中查看近期交易的详细信息。
