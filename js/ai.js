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

    const prompt = `你是一位专业的围棋教练。请对以下围棋对局进行简要分析：

对局信息：
- 棋盘大小：${game.size}路
- 黑方：${game.blackPlayer}
- 白方：${game.whitePlayer}
- 总手数：${moveCount}手
- 黑方手数：${blackMoves}
- 白方手数：${whiteMoves}
- 总提子数：${captures}

SGF棋谱：${sgf}

请从以下几个方面进行分析（用中文回答，控制在300字以内）：
1. 开局评价（布局是否合理）
2. 中盘要点（关键战斗和转换）
3. 双方优劣判断
4. 改进建议

请给出专业但易懂的分析。`;

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
          max_tokens: 500
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
      return this.localAnalysis(game);
    }
  }

  static localAnalysis(game) {
    const moveCount = game.moveHistory.length;
    const captures = game.moveHistory.reduce((sum, m) => sum + (m.captured ? m.captured.length : 0), 0);

    let analysis = `## 本地分析\n\n本局共进行了${moveCount}手，总提子数为${captures}。\n\n`;
    if (moveCount < 20) {
      analysis += `对局尚在布局阶段，双方正在争夺角部和边部的要点。建议注意棋子的效率和配合。\n`;
    } else if (moveCount < 80) {
      analysis += `对局进入中盘阶段，战斗逐渐激烈。建议关注厚薄判断和攻防转换的时机。\n`;
    } else {
      analysis += `对局已进入后半盘，官子阶段需要精确计算。建议注意大小官子的价值判断。\n`;
    }
    if (captures > 5) {
      analysis += `\n本局战斗激烈，共有${captures}个子被提掉。建议在攻击对方时注意自身棋子的安全。\n`;
    }
    analysis += `\n当前为离线分析模式，联网后可获得AI深度分析。`;
    return analysis;
  }

  static async rateMove(game, moveIndex) {
    if (moveIndex < 0 || moveIndex >= game.moveHistory.length) {
      return { score: 0, analysis: '无效的步数' };
    }

    const currentMove = game.moveHistory[moveIndex];
    if (currentMove.pass) {
      return { score: 0, analysis: 'Pass停一手，无法评价' };
    }

    const prompt = `你是一位专业的围棋教练。请评价以下围棋对局中的特定一步棋，使用正负分数系统：

棋局信息：
- 棋盘大小：${game.size}路
- 黑方：${game.blackPlayer}
- 白方：${game.whitePlayer}

需要评价的第${moveIndex + 1}手棋：
- 棋手：${currentMove.playerName}
- 落子位置：${String.fromCharCode(65 + currentMove.x)}${game.size - currentMove.y}

评分标准（-100到+100）：
- +80到+100：妙手！神之一手，非常精彩
- +50到+79：好棋，正确且高效的选择
- +20到+49：可以，合理的应对
- +1到+19：略有不足，但可以接受
- -1到-19：有问题，需要改进
- -20到-49：不好，有明显失误
- -50到-79：很差，明显的错误
- -80到-100：败着，严重失误

请从以下几个角度进行评价（用中文回答）：
1. 这一手棋的分数（-100到+100）
2. 详细分析：为什么给出这个分数？这手棋好在哪/不好在哪？具体分析了哪些方面（如厚薄、效率、方向、时机等）？
3. 如果不是最佳选择，提出更好的建议

请用以下JSON格式返回：
{
  "score": 分数(-100到+100),
  "analysis": "详细评价理由",
  "suggestion": "如有更好的建议则提供，否则为空"
}`;

    try {
      console.log('AI评分开始，请求OpenRouter API...');
      console.log('评价手数:', moveIndex + 1, '位置:', String.fromCharCode(65 + currentMove.x) + (game.size - currentMove.y));

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
          max_tokens: 600
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
          return {
            score: Math.max(-100, Math.min(100, result.score || 0)),
            analysis: result.analysis || content,
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
