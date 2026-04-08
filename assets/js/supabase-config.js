// js/supabase-config.js
// Supabase配置文件 - 请替换为您的实际值

// Supabase项目URL
const SUPABASE_URL = 'https://qkkzhhptgrochqbwtzwa.supabase.co';

// 您的Supabase anon/public key（在Settings -> API中获取）
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFra3poaHB0Z3JvY2hxYnd0endhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTAwMDYsImV4cCI6MjA5MDAyNjAwNn0.4CWjsjuhspZ_r3qP8kmP6ZH-Wc9jNdMR7UHWo289A5k';

console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Key长度:', SUPABASE_ANON_KEY.length);

// 创建Supabase客户端
try {
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // 必须将客户端赋值给window对象
    window.supabaseClient = supabaseClient;
    
    console.log('✅ Supabase客户端创建成功');
    console.log('window.supabaseClient已设置:', typeof window.supabaseClient);
} catch (error) {
    console.error('❌ 创建Supabase客户端失败:', error);
}