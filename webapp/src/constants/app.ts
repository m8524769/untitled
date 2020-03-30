export interface Category {
  value: string;
  label: string;
  children?: Category[];
}

export const APP_CATEGORIES: Category[] = [
  {
    value: '游戏',
    label: '游戏',
    children: [
      {
        value: '策略',
        label: '策略',
      },
      {
        value: '动作',
        label: '动作',
        children: [
          {
            value: '跑酷',
            label: '跑酷',
          },
          {
            value: '格斗',
            label: '格斗',
          },
        ],
      },
      {
        value: '赌场',
        label: '赌场',
        children: [
          {
            value: '扑克牌',
            label: '扑克牌',
          },
          {
            value: '麻将',
            label: '麻将',
          },
        ],
      },
      {
        value: '角色扮演',
        label: '角色扮演',
      },
      {
        value: '教育',
        label: '教育',
        children: [
          {
            value: '幼儿教育',
            label: '幼儿教育',
          },
          {
            value: '青少年教育',
            label: '青少年教育',
          },
          {
            value: '成人教育',
            label: '成人教育',
          },
        ],
      },
      {
        value: '街机',
        label: '街机',
      },
      {
        value: '竞速',
        label: '竞速',
        children: [
          {
            value: '赛车',
            label: '赛车',
          },
          {
            value: '摩托车',
            label: '摩托车',
          },
          {
            value: '自行车',
            label: '自行车',
          },
          {
            value: '三轮车',
            label: '三轮车',
          },
          {
            value: '轮椅',
            label: '轮椅',
          },
        ],
      },
      {
        value: '卡牌',
        label: '卡牌',
      },
      {
        value: '冒险',
        label: '冒险',
      },
      {
        value: '模拟',
        label: '模拟',
        children: [
          {
            value: '真实向',
            label: '真实向',
          },
          {
            value: '沙雕向',
            label: '沙雕向',
          },
        ],
      },
      {
        value: '体育',
        label: '体育',
      },
      {
        value: '文字',
        label: '文字',
      },
      {
        value: '休闲',
        label: '休闲',
      },
      {
        value: '益智',
        label: '益智',
      },
      {
        value: '音乐',
        label: '音乐',
      },
      {
        value: '知识问答',
        label: '知识问答',
      },
      {
        value: '桌面和棋类',
        label: '桌面和棋类',
      },
    ],
  },
  {
    value: '应用',
    label: '应用',
    children: [
      {
        value: '财务',
        label: '财务',
        children: [
          {
            value: '银行类',
            label: '银行类',
          },
          {
            value: '理财类',
            label: '理财类',
          },
          {
            value: '贷款类',
            label: '贷款类',
          },
        ],
      },
      {
        value: '餐饮美食',
        label: '餐饮美食',
      },
      {
        value: '车辆和交通',
        label: '车辆和交通',
      },
      {
        value: '地图和导航',
        label: '地图和导航',
      },
      {
        value: '个性化',
        label: '个性化',
        children: [
          {
            value: '启动器',
            label: '启动器',
          },
          {
            value: '壁纸',
            label: '壁纸',
          },
        ],
      },
      {
        value: '工具',
        label: '工具',
        children: [
          {
            value: '浏览器',
            label: '浏览器',
          },
          {
            value: '文件管理',
            label: '文件管理',
          },
          {
            value: '计算器',
            label: '计算器',
          },
          {
            value: '输入法',
            label: '输入法',
          },
          {
            value: '翻译软件',
            label: '翻译软件',
          },
          {
            value: '扫码软件',
            label: '扫码软件',
          },
        ],
      },
      {
        value: '公司',
        label: '公司',
      },
      {
        value: '购物',
        label: '购物',
        children: [
          {
            value: '线上购物',
            label: '线上购物',
          },
          {
            value: '线下购物',
            label: '线下购物',
          },
        ],
      },
      {
        value: '活动',
        label: '活动',
      },
      {
        value: '家具装修',
        label: '家具装修',
      },
      {
        value: '家庭',
        label: '家庭',
      },
      {
        value: '健康与健身',
        label: '健康与健身',
      },
      {
        value: '教育',
        label: '教育',
      },
      {
        value: '旅游与本地出行',
        label: '旅游与本地出行',
      },
      {
        value: '漫画',
        label: '漫画',
        children: [
          {
            value: '国漫',
            label: '国漫',
          },
          {
            value: '日漫',
            label: '日漫',
          },
          {
            value: '美漫',
            label: '美漫',
          },
        ],
      },
      {
        value: '美容时尚',
        label: '美容时尚',
      },
      {
        value: '软件库与演示',
        label: '软件库与演示',
      },
      {
        value: '商务办公',
        label: '商务办公',
      },
      {
        value: '社交',
        label: '社交',
      },
      {
        value: '社交约会',
        label: '社交约会',
      },
      {
        value: '摄影',
        label: '摄影',
        children: [
          {
            value: '专业摄影',
            label: '专业摄影',
          },
          {
            value: '美颜',
            label: '美颜',
          },
        ],
      },
      {
        value: '生活时尚',
        label: '生活时尚',
      },
      {
        value: '视频播放和剪辑',
        label: '视频播放和剪辑',
        children: [
          {
            value: '视频播放器',
            label: '视频播放器',
          },
          {
            value: 'Vlog',
            label: 'Vlog',
          },
        ],
      },
      {
        value: '体育',
        label: '体育',
      },
      {
        value: '天气',
        label: '天气',
      },
      {
        value: '通讯',
        label: '通讯',
      },
      {
        value: '图书与工具书',
        label: '图书与工具书',
      },
      {
        value: '新闻杂志',
        label: '新闻杂志',
      },
      {
        value: '医疗',
        label: '医疗',
      },
      {
        value: '艺术和设计',
        label: '艺术和设计',
      },
      {
        value: '音乐与音频',
        label: '音乐与音频',
      },
      {
        value: '娱乐',
        label: '娱乐',
      },
      {
        value: '育儿',
        label: '育儿',
      },
    ],
  },
  {
    value: '其他',
    label: '其他',
  },
];

export const ANDROID_ROMS: string[] = [
  'AOKP',
  'AOSP Extended',
  '百度云OS',
  'CopperheadOS',
  'crDroid',
  'CyanogenMod',
  'Fire OS',
  'Flyme',
  'GrapheneOS',
  'LineageOS',
  'Indus OS',
  '乐蛙OS',
  'MIUI',
  '魔趣',
  'OmniROM',
  'OxygenOS',
  'Paranoid Android',
  'PixelExperience',
  'Remix OS',
  'Replicant',
  'Resurrection Remix OS',
  'Smartisan OS',
  'SlimRoms',
  'ViperOS',
  'MokeeOS',
  'AliOS',
  'AICP',
  'GZOSP',
  '其他',
];

export const LANGUAGES: string[] = [
  'العربية',
  'Bosanski',
  'Български',
  'Čeština',
  'Dansk',
  'Deutsch',
  'Ελληνικά',
  'English',
  'Español',
  'فارسی',
  'Suomi',
  'Français',
  'עברית',
  'Hrvatski',
  'Magyar',
  'Bahasa Indonesia',
  'Italiano',
  '日本語',
  '한국어',
  'Lietuvių',
  'Nederlands',
  'Polski',
  'Português',
  'Русский',
  'Slovenčina',
  'Српски / srpski',
  'Svenska',
  'ไทย',
  'Türkçe',
  'Українська',
  '中文（简体）‎',
  '中文（繁體）‎',
];

export const APP_STATUS = {
  0: {
    label: '待审核',
    color: 'yellow',
  },
  1: {
    label: '审核通过',
    color: 'green',
  },
  2: {
    label: '审核未通过',
    color: 'red',
  },
  3: {
    label: '已上架',
    color: 'blue',
  },
  4: {
    label: '已下架',
    color: '',
  },
};

export const APP_PLATFORM = {
  0: '手机',
  1: '平板',
};
