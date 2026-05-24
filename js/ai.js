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

    const prompt = `你是一位拥有职业棋手水平的围棋教练，精通现代围棋理念和AI时代的先进下法。请对以下围棋对局进行深度复盘分析：

【对局基本信息】
- 棋盘大小：${game.size}路
- 黑方：${game.blackPlayer}
- 白方：${game.whitePlayer}
- 总手数：${moveCount}手
- 黑方手数：${blackMoves}
- 白方手数：${whiteMoves}
- 总提子数：${captures}
- 当前局面分差：黑 ${currentScore.blackScore} 目 vs 白 ${currentScore.whiteScore} 目（含贴目）

SGF棋谱：${sgf}

【重要：坐标说明】
- 请使用棋盘显示的坐标系统：横向使用大写字母A-J（不含I），纵向使用数字1-${game.size}（从下往上）
- 例如：棋盘左下角是A1，右下角是J1，左上角是A${game.size}，右上角是J${game.size}

【分析要求】
请从以下几个方面进行专业且有深度的分析（全部用中文回答）：

---

### 📊 1. 全局综合评价（300-500字）
**【开局阶段】**（前20-30手）
- 布局构思评估（大场选择、棋子配合、棋形效率）
- 关键得失判断
- 与现代AI布局的对比（如有明显差异）

**【中盘战斗】**
- 关键战役和转换分析
- 得失判断和形势转折点
- 死活和手筋的运用

**【收官阶段】**
- 收官次序是否正确
- 目数计算精度
- 官子技术评价

---

### 🏆 2. 本局最佳手（TOP 3）
请列出本局最精彩的3手棋，每手包含：
- **第X手 | 坐标**
- **类型**：妙手/好手/手筋/治孤/攻击等
- **精彩之处**：2-3句话说明这手棋的战略价值、计算深度、或巧妙之处
- **带来的收益**：实地/外势/厚薄/胜率等方面的提升

---

### 💡 3. 本局值得改进的地方（3-5处）
请指出本局中最需要改进的地方，包含：
- **第X手 | 坐标**
- **问题分析**：简明说明这手棋的问题（棋形、方向、时机、厚薄判断等）
- **改进建议**：推荐更好的下法及理由

---

### 📈 4. 形势走势判断
请用简明的语言描述本局的形势走向：
- 哪几手是关键转折点
- 双方各自的优势期
- 最终胜负的关键因素

---

### 🎯 5. 学习要点
针对本局特点，提出3-5个可以着重学习和练习的方向。

【语言风格要求】
- 专业但易懂，避免过于晦涩
- 重点突出，条理清晰
- 多用比喻帮助理解
- 控制在2000字以内`;

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
              content: '你是一位专业的围棋教练，擅长分析棋局并给出建设性的意见。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800
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
    
    const prompt = `你是一位拥有职业水平的围棋教练，精通形势判断和棋步分析。请评价以下围棋对局中的特定一步棋。

【重要要求】
- 必须**结合前面所有已下棋步形成的完整形势**来综合评价，不要孤立看这一手
- 分析要考虑：厚薄、实地、外势、棋形、配合、死活、时机等多个维度
- 用教练的视角，既要指出问题，也要给出明确的改进方向

【对局信息】
- 棋盘大小：${game.size}路
- 黑方：${game.blackPlayer}
- 白方：${game.whitePlayer}
- 当前手数：${moveIndex + 1}手

【前面已下棋步】（用于形势判断）
${previousMoves}

【需要评价的棋步】
- 手数：第${moveIndex + 1}手
- 棋手：${currentMove.playerName}
- 落子位置：${currentPos}
- 是否提子：${currentMove.captured && currentMove.captured.length > 0 ? `提了${currentMove.captured.length}子` : '无提子'}

【坐标说明】
- 请使用棋盘显示的坐标系统：横向使用大写字母A-J（不含I），纵向使用数字1-${game.size}（从下往上）
- 例如：棋盘左下角是A1，右下角是J1，左上角是A${game.size}，右上角是J${game.size}

【评分标准（-100到+100）】
- +90~+100: 【妙手】神之一手，兼具创意和实战价值
- +70~+89: 【好棋】准确高效，明显改善局面
- +40~+69: 【可以】合理应对，没有明显问题
- +10~+39: 【普通】一般选择，虽非最佳但可接受
- -10~+9: 【略有不足】有小问题，但不致命
- -40~-11: 【需要改进】有明显问题，需要调整
- -70~-41: 【严重失误】判断错误，损失较大
- -100~-71: 【败着】战略性错误，直接影响胜负

【输出格式】
请严格用以下JSON格式返回，不要有其他文本：
{
  "score": 分数,
  "current_situation": "当前形势分析（2-3句话，简明扼要）",
  "move_analysis": "这手棋的具体评价（3-4句话，详细说明）",
  "strengths": "这手棋的可取之处（如果有）",
  "weaknesses": "这手棋的不足之处",
  "suggestion": "更好的下法建议（坐标+理由）",
  "learning_point": "通过这手棋可以学到什么"
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
              content: '你是一位专业的围棋教练，擅长评价棋步质量，使用正负分数系统。请严格按照指定的JSON格式返回评价结果。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800
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
