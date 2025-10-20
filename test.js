(function() {
    console.log('步骤1: 查找包含答案的数据...\n');
    
    // 查找包含 bzda 的对象
    const dataKeys = Object.keys(window).filter(key => {
        try {
            const obj = window[key];
            if (obj && typeof obj === 'object') {
                if ('bzda' in obj) return true;
                if (JSON.stringify(obj).includes('bzda')) return true;
            }
            return false;
        } catch(e) {
            return false;
        }
    });
    
    console.log('找到包含答案的变量:', dataKeys);
    
    if (dataKeys.length === 0) {
        console.error('错误: 未找到任何包含答案的数据');
        return;
    }
    
    // 获取题目数据
    let examData = null;
    
    for (const key of dataKeys) {
        const obj = window[key];
        
        if (obj.tm && Array.isArray(obj.tm)) {
            examData = obj.tm;
            console.log('从 window.' + key + ' 获取到数据');
            break;
        }
        
        if (Array.isArray(obj) && obj.length > 0 && obj[0].bzda) {
            examData = obj;
            console.log('从 window.' + key + ' 获取到数据（数组格式）');
            break;
        }
    }
    
    if (!examData) {
        console.error('错误: 找到数据但无法解析题目列表');
        return;
    }
    
    console.log('步骤2: 开始填充答案...\n');
    console.log('共 ' + examData.length + ' 道题（数据中）\n');
    
    let successCount = 0;
    let notOnPage = 0;
    
    examData.forEach(q => {
        const tid = String(q.tid); // 转为字符串
        const answer = q.bzda;
        const type = q.tmlx;
        
        try {
            if (type === '单选类' || type === '判断类') {
                // 单选题
                const radio = document.querySelector(`input[name="${tid}"][value="${answer}"]`);
                
                if (!radio) {
                    notOnPage++;
                    return;
                }
                
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
                radio.dispatchEvent(new Event('click', { bubbles: true }));
                console.log('题 ' + tid + ': ' + answer);
                successCount++;
                
            } else if (type === '多选类') {
                // 多选题
                const answers = answer.split('|');
                let checkedCount = 0;
                
                answers.forEach(ans => {
                    const checkbox = document.querySelector(`input[name="${tid}"][value="${ans}"]`);
                    
                    if (checkbox) {
                        checkbox.checked = true;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                        checkbox.dispatchEvent(new Event('click', { bubbles: true }));
                        checkedCount++;
                    }
                });
                
                if (checkedCount > 0) {
                    console.log('题 ' + tid + ': ' + answer + ' (多选)');
                    successCount++;
                } else {
                    notOnPage++;
                }
            }
            
        } catch (e) {
            console.error('题 ' + tid + ' 填充失败:', e);
        }
    });
    
    console.log('\n========== 填充结果 ==========');
    console.log('成功填充: ' + successCount + ' 题');
    console.log('不在当前页面: ' + notOnPage + ' 题');
    console.log('数据总题数: ' + examData.length + ' 题');
    console.log('===============================');
    
})();
