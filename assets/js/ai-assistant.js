// AI问答 + AI出题筑学挑战 独立脚本（支持 Markdown 渲染）
(function() {
    // ========== 筑学挑战状态 ==========
    let currentQuestions = [];
    let userAnswers = new Array(10).fill(-1);
    let currentIndex = 0;
    let isGenerating = false;
    
    // ========== 辅助函数 ==========
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // 渲染 Markdown（如果 marked 库可用）
    function renderMarkdown(text) {
        if (!text) return '';
        if (typeof marked !== 'undefined') {
            try {
                if (typeof marked.parse === 'function') {
                    let result = marked.parse(text, { async: false });
                    if (result && typeof result === 'string') return result;
                }
                return marked(text);
            } catch(e) {
                console.warn('Markdown 解析失败:', e);
                return escapeHtml(text);
            }
        }
        return escapeHtml(text).replace(/\n/g, '<br>');
    }
    
    // ========== AI 出题 ==========
    async function generateQuizQuestions() {
        const systemPrompt = `你是一位中国古代建筑教育专家。请生成10道关于中国古代建筑的选择题，题目需覆盖建筑历史、结构技术、著名建筑、建筑师、经典著作等方面。每道题包含题干、四个选项（A、B、C、D）以及正确答案的字母。请严格按照以下 JSON 格式输出，不要包含任何其他文字：

[
  {
    "text": "题目的问题文本",
    "options": ["选项A内容", "选项B内容", "选项C内容", "选项D内容"],
    "answer": "A"
  },
  ...
]

注意：答案必须是大写字母 A、B、C 或 D。题目要有一定难度但合理，适合知识测试。确保 JSON 格式有效。`;
        
        try {
            const response = await fetch('/deepseek', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: '请生成10道关于中国古代建筑的选择题。' }
                    ],
                    temperature: 0.8,
                    max_tokens: 2000
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API 错误: ${response.status}`);
            }
            
            const data = await response.json();
            const content = data.choices[0].message.content;
            
            let jsonStr = content;
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
            if (jsonMatch) jsonStr = jsonMatch[1];
            
            const questions = JSON.parse(jsonStr);
            
            if (!Array.isArray(questions) || questions.length !== 10) {
                throw new Error('生成的题目数量不是10道');
            }
            
            return questions.map((q, idx) => {
                if (!q.text || !Array.isArray(q.options) || q.options.length !== 4 || !q.answer) {
                    throw new Error(`第${idx+1}题格式无效`);
                }
                const answerMap = { 'A':0, 'B':1, 'C':2, 'D':3 };
                const answerIdx = answerMap[q.answer.toUpperCase()];
                if (answerIdx === undefined) throw new Error(`第${idx+1}题答案无效`);
                return {
                    text: q.text,
                    options: q.options,
                    answer: answerIdx
                };
            });
        } catch (error) {
            console.error('生成题目失败:', error);
            throw new Error(`AI 出题失败：${error.message}`);
        }
    }
    
    // ========== 筑学挑战 UI ==========
    function showQuizStart() {
        const container = document.getElementById('quiz-body');
        if (!container) return;
        container.innerHTML = `
            <div class="quiz-start">
                <h2>📜 测测建筑知多少</h2>
                <p>AI 将实时生成 <strong>10道</strong> 关于中国古代建筑的题目。<br>快来挑战最强大脑吧！</p>
                <button class="quiz-btn" id="start-quiz-btn">开始挑战</button>
            </div>
        `;
        const startBtn = document.getElementById('start-quiz-btn');
        if (startBtn) {
            startBtn.addEventListener('click', async () => {
                if (isGenerating) return;
                isGenerating = true;
                const container = document.getElementById('quiz-body');
                container.innerHTML = `
                    <div class="quiz-start">
                        <h2>🤖 AI 正在出题...</h2>
                        <p>请稍等片刻，AI 正在精心准备10道古建题目。</p>
                        <div style="margin-top:20px;">⏳ 生成中</div>
                    </div>
                `;
                try {
                    currentQuestions = await generateQuizQuestions();
                    userAnswers.fill(-1);
                    currentIndex = 0;
                    showQuizQuestion();
                } catch (error) {
                    container.innerHTML = `
                        <div class="quiz-start">
                            <h2>⚠️ 出题失败</h2>
                            <p>${error.message}</p>
                            <button class="quiz-btn" id="retry-quiz-btn">重试</button>
                            <button class="quiz-btn quiz-btn-outline" id="close-quiz-error">关闭</button>
                        </div>
                    `;
                    document.getElementById('retry-quiz-btn')?.addEventListener('click', () => showQuizStart());
                    document.getElementById('close-quiz-error')?.addEventListener('click', () => {
                        const modal = document.getElementById('quiz-modal');
                        if (modal) modal.style.display = 'none';
                    });
                } finally {
                    isGenerating = false;
                }
            });
        }
    }
    
    function showQuizQuestion() {
        const container = document.getElementById('quiz-body');
        if (!container || !currentQuestions.length) return;
        const q = currentQuestions[currentIndex];
        const selectedVal = userAnswers[currentIndex];
        let optionsHtml = '';
        q.options.forEach((opt, idx) => {
            const isSelected = (selectedVal === idx);
            optionsHtml += `<div class="option ${isSelected ? 'selected' : ''}" data-opt-index="${idx}">${String.fromCharCode(65+idx)}. ${escapeHtml(opt)}</div>`;
        });
        container.innerHTML = `
            <div class="quiz-playing">
                <div class="question-header">
                    <span>第 ${currentIndex+1} / 10 题</span>
                    <span>⚡ 筑学挑战</span>
                </div>
                <div class="question-text">${escapeHtml(q.text)}</div>
                <div class="options" id="options-list">
                    ${optionsHtml}
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <button class="quiz-btn quiz-btn-outline" id="prev-btn" ${currentIndex === 0 ? 'disabled style="opacity:0.5"' : ''}>上一题</button>
                    <button class="quiz-btn" id="next-btn">${currentIndex === 9 ? '提交答卷' : '下一题'}</button>
                </div>
            </div>
        `;
        document.querySelectorAll('.option').forEach(opt => {
            opt.addEventListener('click', () => {
                const idx = parseInt(opt.dataset.optIndex);
                userAnswers[currentIndex] = idx;
                showQuizQuestion();
            });
        });
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    showQuizQuestion();
                }
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (userAnswers[currentIndex] === -1) {
                    alert('请先选择一个答案');
                    return;
                }
                if (currentIndex === 9) {
                    let score = 0;
                    for (let i = 0; i < 10; i++) {
                        if (userAnswers[i] === currentQuestions[i].answer) score++;
                    }
                    showQuizResult(score);
                } else {
                    currentIndex++;
                    showQuizQuestion();
                }
            });
        }
    }
    
    function showQuizResult(score) {
        let rating = '';
        if (score <= 3) rating = '初出茅庐 · 再读梁思成';
        else if (score <= 6) rating = '博学秀才 · 营造有术';
        else if (score <= 9) rating = '建筑大师 · 匠心独具';
        else rating = '营造宗师 · 满级大神';
        const container = document.getElementById('quiz-body');
        if (!container) return;
        container.innerHTML = `
            <div class="quiz-result">
                <h2>挑战完成</h2>
                <div class="result-score">得分：${score} / 10</div>
                <div class="result-rating">${rating}</div>
                <button class="quiz-btn" id="restart-quiz">重新挑战</button>
                <button class="quiz-btn quiz-btn-outline" id="new-quiz">AI生成新题目</button>
            </div>
        `;
        const restartBtn = document.getElementById('restart-quiz');
        const newQuizBtn = document.getElementById('new-quiz');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                userAnswers.fill(-1);
                currentIndex = 0;
                showQuizQuestion();
            });
        }
        if (newQuizBtn) {
            newQuizBtn.addEventListener('click', () => {
                showQuizStart();
                setTimeout(() => {
                    const startBtn = document.getElementById('start-quiz-btn');
                    if (startBtn) startBtn.click();
                }, 100);
            });
        }
    }
    
    // ========== AI 问答 ==========
    let qaInitialized = false;
    function initAIQA() {
        if (qaInitialized) return;
        qaInitialized = true;
        
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        if (!chatMessages || !userInput || !sendBtn) return;
        
        function addMessage(text, isUser = false, isError = false) {
            const div = document.createElement('div');
            div.className = `message ${isUser ? 'user' : ''}`;
            let contentHtml = '';
            if (isUser) {
                contentHtml = escapeHtml(text);
            } else {
                contentHtml = renderMarkdown(text);
            }
            const bubbleClass = isError ? 'message-bubble error' : 'message-bubble';
            div.innerHTML = `
                <div class="message-avatar">${isUser ? '我' : 'AI'}</div>
                <div class="${bubbleClass}">${contentHtml}</div>
            `;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        let loadingDiv = null;
        function showLoading() {
            if (loadingDiv) return;
            loadingDiv = document.createElement('div');
            loadingDiv.className = 'message';
            loadingDiv.innerHTML = `
                <div class="message-avatar">AI</div>
                <div class="message-bubble" style="background:#f0f0f0;"><em>正在思考...</em></div>
            `;
            chatMessages.appendChild(loadingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        function hideLoading() {
            if (loadingDiv) {
                loadingDiv.remove();
                loadingDiv = null;
            }
        }
        
        async function callDeepSeek(userQuestion) {
            const systemPrompt = `你是一位专业的中国古代建筑专家，精通中国建筑历史、结构技术、著名建筑、建筑师和经典著作。请用中文回答用户的问题，语言通俗易懂，内容准确详实。如果问题不相关，请礼貌地引导回建筑话题。`;
            try {
                const response = await fetch('/deepseek', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'deepseek-chat',
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userQuestion }
                        ],
                        temperature: 0.7,
                        max_tokens: 800
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || `API 错误: ${response.status}`);
                }
                const data = await response.json();
                return data.choices[0].message.content;
            } catch (error) {
                console.error('Worker 代理调用失败:', error);
                let errorMsg = `抱歉，AI 服务出错了：${error.message}`;
                if (error.message.includes('401')) errorMsg = 'API Key 无效，请联系管理员。';
                if (error.message.includes('429')) errorMsg = 'API 调用频率过高，请稍后再试。';
                addMessage(errorMsg, false, true);
                return null;
            }
        }
        
        async function sendMessage() {
            const msg = userInput.value.trim();
            if (!msg) return;
            addMessage(msg, true);
            userInput.value = '';
            showLoading();
            const reply = await callDeepSeek(msg);
            hideLoading();
            if (reply) addMessage(reply, false);
        }
        
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    // ========== 初始化入口 ==========
    function init() {
        const aiQaCard = document.getElementById('ai-qa-card');
        const quizCard = document.getElementById('quiz-card');
        const qaModal = document.getElementById('qa-modal');
        const quizModal = document.getElementById('quiz-modal');
        const closeQa = document.getElementById('close-qa-modal');
        const closeQuiz = document.getElementById('close-quiz-modal');
        
        if (!aiQaCard || !quizCard) return;
        
        aiQaCard.addEventListener('click', () => {
            qaModal.style.display = 'flex';
            initAIQA();
        });
        quizCard.addEventListener('click', () => {
            quizModal.style.display = 'flex';
            showQuizStart();
        });
        if (closeQa) closeQa.addEventListener('click', () => qaModal.style.display = 'none');
        if (closeQuiz) closeQuiz.addEventListener('click', () => quizModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === qaModal) qaModal.style.display = 'none';
            if (e.target === quizModal) quizModal.style.display = 'none';
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();