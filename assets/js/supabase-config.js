// supabase-config.js
// 通过 Cloudflare Worker 代理 Supabase 请求，隐藏真实 URL 和 Anon Key

// Worker 代理地址（你的 Cloudflare Worker 域名 + /supabase 路径）
const SUPABASE_PROXY_URL = 'https://zhujijingwei.pages.dev/supabase';

// 创建 Supabase 客户端
// 注意：第二个参数可以填写任意字符串，因为实际鉴权在 Worker 端使用真实 Anon Key
const supabaseClient = window.supabase.createClient(SUPABASE_PROXY_URL, 'dummy-key');

// 将客户端挂载到 window 对象，供全局使用
window.supabaseClient = supabaseClient;

// 可选：输出日志确认加载成功
console.log('✅ Supabase 客户端已通过 Worker 代理创建，代理地址:', SUPABASE_PROXY_URL);