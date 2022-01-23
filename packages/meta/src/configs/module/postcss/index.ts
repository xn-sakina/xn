export const getPostcssConfig = () => {
  const config: Record<string, any> = {
    plugins: [
      require.resolve('postcss-flexbugs-fixes'),
      [
        require.resolve('postcss-preset-env'),
        {
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
        },
      ],
      require.resolve('postcss-normalize'),
    ],
  }

  return config
}
