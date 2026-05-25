// AI 分析服务
class AIAnalyzer {
  static API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  static getApiKey() {
    return localStorage.getItem('go_ai_api_key') || '';
  }

  static setApiKey(key) {
    localStorage.setItem('go_ai_api_key', key);
  }

  static async analyze(game) {
    const sgf = game.toSGF();
    const moveCount = game.moveHistory.length;
    const blackMoves = game.moveHistory.filter(m => m.player === 1).length;
    const whiteMoves = game.moveHistory.filter(m => m.player === 2).length;
    const captures = game.moveHistory.reduce((sum, m) => sum + (m.captured ? m.captured.length : 0), 0);
    const currentScore = game.calculateScore ? game.calculateScore() : { blackScore: 0, whiteScore: 6.5 };
    const letters = 'ABCDEFGHJKLMNOPQRST';

    const prompt = `你是一位职业九段围棋教练，精通AlphaGo/KataGo等AI围棋理念。请对以下围棋对局进行专业复盘分析。

【对局信息】
- 棋盘：${game.size}路
- 黑方：${game.blackPlayer}
- 白方：${game.whitePlayer}
- 手数：${moveCount}（黑${blackMoves} / 白${whiteMoves}）
- 提子：${captures}个
- 当前：黑${currentScore.blackScore}目 vs 白${currentScore.whiteScore}目（含贴目）

【坐标系统】
- 横向：A-${letters[game.size-1]||'T'}（不含I），纵向：1-${game.size}
- 左下A1，右下${letters[game.size-1]||'T'}1，左上A${game.size}，右上${letters[game.size-1]||'T'}${game.size}

SGF：${sgf}

【分析框架 - 请严格按此结构输出】

### 1. 全局总评（分阶段）
**布局**（前${Math.min(30, Math.floor(moveCount/3))}手）：
- 大场选择、棋子配合、棋形效率
- 与AI布局理念的对比

**中盘**：
- 关键战役、转换得失
- 形势转折点

**收官**：
- 官子次序、目数精度

### 2. 最佳手 TOP3
每手格式：
- 第X手 | 坐标 | 类型（妙手/好手/手筋）
- 价值：实地/外势/厚薄/死活

### 3. 问题手与改进
每处格式：
- 第X手 | 坐标
- 问题：棋形/方向/时机/厚薄
- 改进：推荐下法及理由

### 4. 形势走势
- 关键转折点
- 双方优势期
- 胜负关键

### 5. 学习要点
3-5个针对性练习方向

【要求】
- 专业但通俗，用比喻辅助理解
- 每部分简明扼要，总字数1500字以内
- 必须结合具体棋步坐标分析，不要泛泛而谈`;

    try {
      console.log('AI分析开始，请求OpenRouter API...');
      const apiKey = this.getApiKey();
      if (!apiKey) {
        throw new Error('请先配置 OpenRouter API Key');
      }
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Go Game Analysis'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b:free',
          messages: [
            {
              role: 'system',
              content: '你是职业九段围棋教练，精通AlphaGo/KataGo理念。分析时必须结合具体棋步坐标，避免泛泛而谈。输出简洁专业。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1200,
          temperature: 0.3
        })
      });

      console.log('API响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API错误详情:', errorData || `HTTP ${response.status}`);
        throw new Error(`API请求失败: ${response.status} - ${errorData?.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('AI分析成功，返回数据:', data);
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI分析失败:', error.message || error);
      throw error;
    }
  }

  static async rateMove(game, moveIndex) {
    if (moveIndex < 0 || moveIndex >= game.moveHistory.length) {
      return { score: 0, analysis: '无效的步数' };
    }

    const currentMove = game.moveHistory[moveIndex];
    if (currentMove.pass) {
      return { score: 0, analysis: 'Pass停一手，无法评价' };
    }

    const letters = 'ABCDEFGHJKLMNOPQRST';
    const currentPos = `${letters[currentMove.x]}${game.size - currentMove.y}`;
    
    // 构建前面所有棋步的信息
    const previousMoves = game.moveHistory.slice(0, moveIndex).map((m, i) => {
      if (m.pass) {return `${i + 1}. ${m.playerName} Pass`;}
      const pos = `${letters[m.x]}${game.size - m.y}`;
      const cap = m.captured && m.captured.length > 0 ? ` (提${m.captured.length}子)` : '';
      return `${i + 1}. ${m.playerName} ${pos}${cap}`;
    }).join('\n');
    
    const prompt = `你是一位职业九段围棋教练，精通AI围棋分析。请评价以下特定棋步。

【对局信息】
- 棋盘：${game.size}路
- 黑方：${game.blackPlayer}
- 白方：${game.whitePlayer}
- 当前：第${moveIndex + 1}手

【已下棋步】
${previousMoves}

【评价棋步】
- 第${moveIndex + 1}手 | ${currentMove.playerName} | ${currentPos}
- 提子：${currentMove.captured && currentMove.captured.length > 0 ? currentMove.captured.length + '子' : '无'}

【坐标】横向A-${letters[game.size-1]||'T'}（不含I），纵向1-${game.size}

【评分标准】
+90~+100:妙手 +70~+89:好棋 +40~+69:可以 +10~+39:普通
-10~+9:略有不足 -40~-11:需改进 -70~-41:严重失误 -100~-71:败着

【输出格式 - 严格JSON，无其他文本】
{
  "score": 分数,
  "current_situation": "形势分析（2句）",
  "move_analysis": "棋步评价（3句，结合前面形势）",
  "strengths": "可取之处",
  "weaknesses": "不足之处",
  "suggestion": "改进建议（含坐标）",
  "learning_point": "学习要点"
}`;

    try {
      console.log('AI评分开始，请求OpenRouter API...');
      console.log('评价手数:', moveIndex + 1, '位置:', currentPos);

      const apiKey = this.getApiKey();
      if (!apiKey) {
        throw new Error('请先配置 OpenRouter API Key');
      }
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Go Move Rating'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b:free',
          messages: [
            {
              role: 'system',
              content: '你是职业九段围棋教练，精通AI围棋分析。评价必须结合前面所有棋步的完整形势，给出具体坐标和改进建议。严格按JSON格式输出。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        })
      });

      console.log('API响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API错误详情:', errorData || `HTTP ${response.status}`);
        throw new Error(`API请求失败: ${response.status} - ${errorData?.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('AI评分成功，返回数据:', data);

      const content = data.choices[0].message.content;
      console.log('AI返回内容:', content);

      try {
        const jsonMatch = content.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          console.log('解析到JSON:', jsonMatch[0]);
          const result = JSON.parse(jsonMatch[0]);
          
          // 构建格式化的分析内容
          const formattedAnalysis = `## AI 专业评价\n\n` +
            `### 📊 当前形势\n${result.current_situation || '暂无形势分析'}\n\n` +
            `### 🎯 棋步分析\n${result.move_analysis || '暂无详细分析'}\n\n` +
            (result.strengths ? `### ✅ 可取之处\n${result.strengths}\n\n` : '') +
            (result.weaknesses ? `### ⚠️ 不足之处\n${result.weaknesses}\n\n` : '') +
            (result.suggestion ? `### 💡 改进建议\n${result.suggestion}\n\n` : '') +
            (result.learning_point ? `### 📚 学习要点\n${result.learning_point}\n\n` : '');
          
          return {
            score: Math.max(-100, Math.min(100, result.score || 0)),
            analysis: formattedAnalysis,
            suggestion: result.suggestion || ''
          };
        }
      } catch (parseError) {
        console.error('JSON解析失败:', parseError);
        return { score: 0, analysis: content, suggestion: '' };
      }

      return { score: 0, analysis: content, suggestion: '' };
    } catch (error) {
      console.error('AI评分失败:', error.message || error);
      // 网络/API错误时抛出，让上层处理
      throw error;
    }
  }

  static localRateMove(game, moveIndex) {
    const currentMove = game.moveHistory[moveIndex];
    const captures = currentMove.captured ? currentMove.captured.length : 0;

    let score = 20;
    let analysis = '';

    if (captures > 0) {
      score += captures * 15;
      analysis = `本手吃掉了${captures}个子，表现不错！`;
    } else if (moveIndex < game.size * 2) {
      score = 35;
      analysis = '布局阶段的常规应对，位置选择合理。';
    } else {
      score = 15;
      analysis = '本手为中盘阶段的普通应对。';
    }

    score = Math.min(100, Math.max(-100, score));

    return {
      score,
      analysis: `## 本地评分\n\n**分数：${score}/100**\n\n${analysis}\n\n当前为离线评分，联网后可获得AI精确评分。`,
      suggestion: ''
    };
  }
}
