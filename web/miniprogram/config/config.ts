// 环境配置接口
interface Config {
  baseURL: string;
  timeout: number;
}

// 环境配置
const config: Record<string, Config> = {
  // 开发环境
  development: {
    baseURL: 'http://localhost:3000',  // 本地开发
    // 注意：小程序不能直接访问 localhost，需要：
    // 1. 使用真机调试
    // 2. 或者使用内网 IP（如：http://192.168.1.100:3000）
    timeout: 10000,
  },
  
  // 生产环境
  production: {
    baseURL: 'https://api.yourdomain.com',  // 生产环境 API 地址
    timeout: 10000,
  },
};

// 当前环境（根据编译模式自动切换）
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// 导出配置
export default {
  ...config[env],
};
