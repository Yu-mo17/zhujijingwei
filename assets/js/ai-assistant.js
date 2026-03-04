// ==================== AI助手功能脚本 ====================
// 文件名: ai-assistant.js
// 作者: 筑迹经纬团队
// 版本: 1.0.0
// 功能: 提供古建筑知识问答AI助手（模拟版本）

// 等待页面完全加载后初始化AI助手
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏯 筑迹经纬AI助手正在初始化...');
    initAIAssistant();
});

// 初始化AI助手
function initAIAssistant() {
    // 获取DOM元素
    const aiFloatBtn = document.getElementById('ai-float-btn');
    const aiChatWindow = document.getElementById('ai-chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    
    // 检查必要的DOM元素是否存在
    if (!aiFloatBtn || !aiChatWindow || !chatMessages) {
        console.error('❌ AI助手元素未找到，请检查HTML结构');
        return;
    }
    
    console.log('✅ AI助手元素加载成功');
    
    // ========== 事件监听器设置 ==========
    
    // 1. 点击悬浮按钮显示聊天窗口
    aiFloatBtn.addEventListener('click', function() {
        aiChatWindow.style.display = 'flex';
        console.log('💬 聊天窗口已打开');
        // 延迟100ms后自动聚焦到输入框
        setTimeout(() => {
            userInput.focus();
        }, 100);
    });
    
    // 2. 点击关闭按钮隐藏聊天窗口
    closeChatBtn.addEventListener('click', function() {
        aiChatWindow.style.display = 'none';
        console.log('💬 聊天窗口已关闭');
    });
    
    // 3. 点击发送按钮发送消息
    sendBtn.addEventListener('click', handleSendMessage);
    
    // 4. 按Enter键发送消息
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    
    // 5. 设置快速问题按钮点击事件
    setupQuickQuestions();
    
    // 6. 点击聊天窗口外部关闭（可选功能，如果需要可以取消注释）
    /*
    document.addEventListener('click', function(event) {
        if (aiChatWindow.style.display === 'flex' && 
            !aiChatWindow.contains(event.target) && 
            !aiFloatBtn.contains(event.target)) {
            aiChatWindow.style.display = 'none';
        }
    });
    */
    
    // ========== 核心功能函数 ==========
    
    // 处理发送消息
    async function handleSendMessage() {
        const message = userInput.value.trim();
        
        // 检查消息是否为空
        if (!message) {
            userInput.focus();
            return;
        }
        
        console.log(`📤 用户发送消息: "${message}"`);
        
        // 添加用户消息到聊天界面
        addMessage(message, 'user');
        
        // 清空输入框
        userInput.value = '';
        
        // 显示"正在思考..."提示
        const thinkingMsg = addMessage('正在思考...', 'ai', true);
        
        try {
            // 模拟网络延迟，使体验更真实
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // 获取AI回复（模拟版本）
            const aiResponse = getAIResponse(message);
            
            // 移除"正在思考..."提示
            thinkingMsg.remove();
            
            // 添加AI回复到聊天界面
            addMessage(aiResponse, 'ai');
            
            console.log('✅ AI回复已显示');
            
        } catch (error) {
            // 移除"正在思考..."提示
            thinkingMsg.remove();
            
            // 显示错误信息
            addMessage('抱歉，我暂时无法回答这个问题。请稍后再试或尝试其他问题。', 'ai');
            
            console.error('❌ AI请求失败:', error);
        }
    }
    
    // 添加消息到聊天界面
    function addMessage(content, sender, isThinking = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';
        
        if (sender === 'user') {
            // 用户消息
            messageDiv.innerHTML = `
                <div class="ai-avatar user-avatar">您</div>
                <div class="message-content">
                    <strong>您</strong>
                    <p>${escapeHtml(content)}</p>
                </div>
            `;
        } else {
            // AI消息
            const avatar = isThinking ? '🤔' : '🏛️';
            const title = isThinking ? '思考中...' : '古建助手';
            const formattedContent = formatResponse(content);
            
            messageDiv.innerHTML = `
                <div class="ai-avatar">${avatar}</div>
                <div class="message-content">
                    <strong>${title}</strong>
                    ${formattedContent}
                </div>
            `;
        }
        
        // 添加到聊天区域
        chatMessages.appendChild(messageDiv);
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageDiv;
    }
    
    // 获取AI回复（模拟版本）
    function getAIResponse(question) {
        console.log(`🤖 处理问题: "${question}"`);
        
        // 将问题转为小写以便匹配
        const lowerQuestion = question.toLowerCase().trim();
        
        // 遍历知识库，查找匹配项
        for (const [key, answer] of Object.entries(knowledgeBase)) {
            // 检查关键词是否在问题中
            if (lowerQuestion.includes(key.toLowerCase())) {
                console.log(`✅ 匹配到关键词: "${key}"`);
                return answer;
            }
        }
        
        // 如果没有完全匹配，尝试部分匹配
        const partialMatch = findPartialMatch(lowerQuestion);
        if (partialMatch) {
            return partialMatch;
        }
        
        // 默认回复
        return getDefaultResponse(question);
    }
    
    // 设置快速问题按钮
    function setupQuickQuestions() {
        const quickButtons = document.querySelectorAll('.quick-q');
        
        quickButtons.forEach(button => {
            button.addEventListener('click', function() {
                const question = this.getAttribute('data-q');
                if (question && userInput) {
                    userInput.value = question;
                    // 触发发送消息
                    setTimeout(() => {
                        handleSendMessage();
                    }, 10);
                }
            });
        });
    }
    
    console.log('🎉 AI助手初始化完成，等待用户交互...');
}

// ==================== 古建筑知识库 ====================
// 这是模拟AI的核心，包含了预设的问题和答案
// 你可以随时添加、修改或删除这里的条目

const knowledgeBase = {
    // 著名古建筑
    '赵州桥': '赵州桥（又称安济桥）建于隋朝（公元595-605年），由工匠李春设计建造。\n\n它是世界上现存最早、保存最完整的单孔敞肩石拱桥，主拱跨度37.02米。\n\n其"敞肩拱"设计不仅减轻了桥身重量，还增加了泄洪能力，体现了隋代高超的桥梁工程技术。',
    
    '故宫': '故宫（紫禁城）始建于明朝永乐四年（1406年），历时14年建成。\n\n建筑特点包括：\n\n1. 布局：严格的轴线对称，前朝后寝\n2. 结构：木结构为主，采用抬梁式构架\n3. 屋顶：黄色琉璃瓦，代表皇权至高无上\n4. 斗拱：太和殿使用最高等级的11踩斗拱\n5. 装饰：彩绘等级分明，金龙和玺彩绘为最高等级',
    
    '长城': '长城始建于春秋战国时期，秦朝连接各国长城，明朝大规模重修。\n\n工程技术包括：\n\n🏔️ 选址：沿山脊建造，利用地形\n🧱 材料：因地制宜（砖石、夯土、芦苇）\n🛡️ 防御体系：烽火台、敌楼、关城、城墙\n📏 规模：明长城全长8851.8公里，东起鸭绿江，西至嘉峪关',
    
    '天坛': '天坛是明清皇帝祭天场所，建于1420年。\n\n建筑特色：\n\n🔵 圜丘坛：三层圆形石坛，符合"天圆"观念\n🔴 祈年殿：三重檐圆形攒尖顶，28根柱子象征天象\n📐 声学设计：回音壁、三音石、对话石的精妙声学效果\n🎨 色彩象征：蓝色琉璃瓦象征天空',
    
    '颐和园': '颐和园是中国现存最完整的皇家园林，融合了南北园林艺术：\n\n🏞️ 布局：以万寿山、昆明湖为主体\n🏯 建筑：佛香阁、长廊、石舫、苏州街\n🎋 园林艺术：借景西山，移步换景\n📜 历史：始建于1750年，1860年被毁，1888年重建',
    
    // 建筑结构
    '斗拱': '斗拱是中国古建筑特有的木构件，由"斗"和"拱"组成：\n\n**功能**\n\n1. 承重：将屋檐重量传递到柱子上\n2. 抗震：通过层层叠叠的结构吸收地震能量\n3. 装饰：等级越高，斗拱层数越多\n\n**等级**\n\n太和殿：11踩斗拱（最高等级）\n一般宫殿：5-7踩斗拱\n民居：简单斗拱或不用',
    
    '榫卯': '榫卯是中国古代木结构建筑的核心连接技术，不使用钉子，通过凹凸结合固定构件：\n\n**常见类型**\n\n1. 燕尾榫：用于板件连接，越拉越紧\n2. 穿带榫：用于大型梁架连接\n3. 格肩榫：用于直角连接\n4. 勾挂榫：用于悬挑结构\n\n**抗震原理**：榫卯结构允许微小位移，能有效吸收地震能量，如应县木塔经历多次地震不倒。',
    
    '屋顶': '中国古代建筑屋顶形式多样，等级分明：\n\n🏛️ 庑殿顶：四面斜坡，一条正脊，四条垂脊（最高等级）\n🏯 歇山顶：九脊顶，由一条正脊、四条垂脊、四条戗脊组成\n🏮 悬山顶：两面坡，檩条伸出山墙\n🏡 硬山顶：两面坡，檩条不伸出山墙\n⛩️ 攒尖顶：锥形屋顶，用于亭、塔、阁',
    
    // 朝代建筑特色
    '唐代建筑': '唐代建筑特点：\n\n1. 雄浑大气：斗拱宏大，出檐深远\n2. 屋顶平缓：坡度较缓，檐口平直\n3. 柱式粗壮：柱子有显著的收分和卷杀\n4. 色彩简洁：以朱白为主，少用彩绘\n5. 代表实例：山西佛光寺东大殿（国内现存最早的木构建筑之一）',
    
    '宋代建筑': '宋代建筑特点：\n\n1. 精巧秀丽：斗拱变小，装饰增多\n2. 屋顶陡峭：举折明显，屋檐起翘\n3. 色彩丰富：彩绘精美，青绿为主\n4. 理论成熟：《营造法式》颁布，建筑标准化\n5. 代表实例：山西晋祠圣母殿',
    
    '明清建筑': '明清建筑特点：\n\n1. 规制严格：建筑等级制度完善\n2. 装饰繁复：彩绘、雕刻、琉璃广泛应用\n3. 斗拱装饰化：结构功能减弱，装饰功能增强\n4. 群体布局：建筑组群规划严谨\n5. 代表实例：北京故宫、天坛',
    
    // 建筑书籍
    '营造法式': '《营造法式》由北宋李诫编修，1103年颁布，是中国古代最完整的建筑技术著作：\n\n📘 内容：34卷，357篇，3555条\n📏 制度：规定了建筑模数制（材分制）\n🔧 工料：详细记载用工、用料的计算方法\n🎨 图样：包含大量建筑图样和彩画制度',
    
    '园冶': '《园冶》由明代计成撰写，是中国第一部园林艺术理论专著：\n\n🌳 内容：三卷，论述造园理论、设计和施工\n🎋 理念："虽由人作，宛自天开"\n🏞️ 技法：借景、对景、框景、障景等手法\n🌺 要素：山石、水体、植物、建筑的配合',
    
    // 建筑技术
    '抗震': '中国古代木结构建筑的抗震原理：\n\n1. 柔韧框架：榫卯连接允许微小变形\n2. 斗拱减震：层层斗拱吸收地震能量\n3. 柱础滑动：柱础与地面不固定连接\n4. 屋顶配重：厚重屋顶增加稳定性\n5. 实例：山西应县木塔（67米高）经历40多次地震不倒',
    
    '木材防腐': '古建筑木材防腐技术：\n\n1. 选材：使用楠木、柏木等耐腐木材\n2. 干燥：自然阴干数年\n3. 涂料：桐油、大漆等天然涂料\n4. 结构：保证通风，避免积水\n5. 维护：定期检修，更换腐朽构件',
    
    // 建筑名家
    '李春': '李春是隋代著名工匠，赵州桥的设计者和建造者。\n\n设计创新包括：\n1. 首创敞肩拱结构，减轻桥身重量\n2. 采用纵向并列砌筑法，增强结构整体性\n3. 精确的石料加工技术，实现无缝拼接\n\n遗憾的是，关于他生平的详细记载很少，但他的工程技术成就通过赵州桥流传千古。',
    
    '李诫': '李诫（1035-1110），北宋建筑学家，编著《营造法式》。\n\n他系统总结了宋代建筑技术，建立了中国最早的建筑模数制，对后世建筑标准化产生了深远影响。',
    
    // 同义词和变体
    '紫禁城': '紫禁城是故宫的别称，是明清两代的皇家宫殿，占地72万平方米，有大小宫殿70多座，房屋9000余间。\n\n其名称来源于古代星象学中的"紫微垣"，寓意皇帝居所如同天帝居所。',
    
    '安济桥': '安济桥是赵州桥的正式名称，建于隋代，是世界上最早的敞肩石拱桥。',
    
    '铺作': '铺作是宋代对斗拱的称呼，在《营造法式》中有详细规定。',
};

// ==================== 智能匹配函数 ====================

// 查找部分匹配
function findPartialMatch(question) {
    // 如果问题包含特定关键词但没有完全匹配
    if (question.includes('什么') && question.includes('作用')) {
        if (question.includes('斗拱') || question.includes('铺作')) {
            return knowledgeBase['斗拱'];
        }
        if (question.includes('榫卯')) {
            return knowledgeBase['榫卯'];
        }
        return '如果您询问某个具体建筑构件的作用，可以告诉我具体的名称，比如"斗拱的作用"、"榫卯的作用"等。我会为您详细解释。';
    }
    
    if (question.includes('怎么') || question.includes('如何')) {
        if (question.includes('抗震') || question.includes('防震')) {
            return knowledgeBase['抗震'];
        }
        if (question.includes('防腐') || question.includes('防虫')) {
            return knowledgeBase['木材防腐'];
        }
        return '如果您想了解古建筑的建造方法或技术，请具体说明是哪方面的技术，比如"古建筑如何抗震"、"木结构如何防腐"等。';
    }
    
    if ((question.includes('哪个') || question.includes('什么')) && question.includes('最')) {
        return '中国古代建筑有很多"之最"：\n\n🏆 **最早木构**：佛光寺东大殿（唐代）\n🏆 **最高木塔**：应县木塔（67.31米）\n🏆 **最长建筑**：长城（明长城8851.8公里）\n🏆 **最大宫殿**：故宫（72万平方米）\n🏆 **最早石拱桥**：赵州桥（隋代）\n\n您想了解哪一个的具体信息？';
    }
    
    if (question.includes('特点') || question.includes('特征') || question.includes('特色')) {
        if (question.includes('唐')) {
            return knowledgeBase['唐代建筑'];
        }
        if (question.includes('宋')) {
            return knowledgeBase['宋代建筑'];
        }
        if (question.includes('明') || question.includes('清')) {
            return knowledgeBase['明清建筑'];
        }
    }
    
    return null;
}

// 获取默认回复
function getDefaultResponse(question) {
    return `关于"${question}"，我推荐您：\n\n🔍 **在本站探索**：\n• 使用"时间维度"了解各朝代建筑特点\n• 使用"地理维度"查看地域建筑差异\n• 查阅"建筑书籍"学习《营造法式》等经典著作\n\n📚 **建议查询以下内容**：\n1. 具体建筑名称（如：赵州桥、故宫、长城）\n2. 建筑构件（如：斗拱、榫卯、屋顶形式）\n3. 朝代特色（如：唐代建筑特点、宋代建筑）\n4. 建筑技术（如：古建筑抗震、木材防腐）\n5. 建筑名家（如：李春、李诫）\n\n💡 或者点击下方的快速提问按钮，获取常见问题的答案。`;
}

// ==================== 工具函数 ====================

// 格式化响应文本（增强版）
function formatResponse(text) {
    // 1. HTML转义
    let html = escapeHtml(text);
    
    // 2. 处理加粗标记
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 3. 按空行分割段落
    const paragraphs = html.split(/\n\s*\n/);
    let result = '';
    
    paragraphs.forEach(paragraph => {
        if (!paragraph.trim()) return;
        
        // 4. 检查是否是列表段落
        const lines = paragraph.split('\n');
        const isList = lines.some(line => {
            const trimmed = line.trim();
            return /^(\d+\.|•|\-|▶|✓|👉|📍|🏔️|🧱|🛡️|📏|🔵|🔴|📐|🎨|🏞️|🏯|🎋|📜|🔸|🏮|🏡|⛩️|📘|🔧|🎨|🌳|🌺)/.test(trimmed);
        });
        
        if (isList) {
            // 列表段落
            result += '<ul class="ai-list">';
            lines.forEach(line => {
                const trimmed = line.trim();
                if (trimmed) {
                    result += `<li>${trimmed}</li>`;
                }
            });
            result += '</ul>';
        } else {
            // 普通段落
            paragraph = paragraph.replace(/\n/g, '<br>');
            result += `<p>${paragraph}</p>`;
        }
    });
    
    return result;
}

// HTML转义，防止XSS攻击
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== 控制台欢迎信息 ====================
console.log(`
┌─────────────────────────────────────┐
│   🏯 筑迹经纬AI助手 v1.0.0         │
│                                      │
│   已加载 ${Object.keys(knowledgeBase).length} 个古建筑知识点  │
│   输入 help 查看可用命令             │
└─────────────────────────────────────┘
`);

// 添加控制台帮助命令（开发调试用）
window.AIAssistant = {
    version: '1.0.0',
    knowledgeCount: Object.keys(knowledgeBase).length,
    showTopics: function() {
        console.log('📚 可用主题：');
        Object.keys(knowledgeBase).forEach((key, index) => {
            console.log(`${index + 1}. ${key}`);
        });
    },
    addKnowledge: function(key, value) {
        knowledgeBase[key] = value;
        console.log(`✅ 已添加知识点: "${key}"`);
    }
};