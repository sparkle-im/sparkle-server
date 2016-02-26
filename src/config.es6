const config = {
  mongodb: process.env.MONGODB || 'mongodb://192.168.99.100:32768/sparkle-test',
  port: process.env.PORT || '3000'
};
export default config;
