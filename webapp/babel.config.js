module.exports = function (api) {
  api.cache(true);

  const presets = [
    '@babel/preset-react',
    '@babel/preset-env',
    'mobx',
  ];

  const plugins = [
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', {
      // decoratorsBeforeExport: true,
      legacy: true,
    }],
    ['@babel/plugin-proposal-class-properties', {
      loose: true,
    }],
    '@babel/plugin-proposal-object-rest-spread',
    // '@babel/plugin-proposal-optional-chaining',
    // '@babel/plugin-proposal-nullish-coalescing-operator',
    // ['@babel/plugin-proposal-pipeline-operator', {
    //   proposal: 'minimal',
    // }],
    ['import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }],
  ];

  return {
    presets,
    plugins,
  };
}
