import React, { useState, useCallback, useEffect } from 'react';
import { GoEngine } from './engine';
import { LocalAI } from './ai';
import Board from './components/Board';
import { StoneColor, EMPTY, BLACK, WHITE, Point, GameConfig, ThemeName, THEMES } from './types';

type Page = 'home' | 'setup' | 'game' | 'settings';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [theme, setTheme] = useState<ThemeName>('classic');
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    boardSize: 19,
    playerColor: BLACK,
    aiLevel: 'medium',
    aiType: 'local',
    komi: 6.5,
  });
  const [engine, setEngine] = useState<GoEngine | null>(null);
  const [ai, setAi] = useState<LocalAI | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  const startGame = useCallback((config: GameConfig) => {
    const newEngine = new GoEngine(config.boardSize);
    setEngine(newEngine);
    setGameConfig(config);

    if (config.aiType === 'local') {
      const difficultyMap = {
        easy: LocalAI.DIFFICULTY_EASY,
        medium: LocalAI.DIFFICULTY_MEDIUM,
        hard: LocalAI.DIFFICULTY_HARD,
      };
      setAi(new LocalAI(difficultyMap[config.aiLevel]));
    } else {
      setAi(null);
    }

    setMoveHistory([]);
    setGameMessage('');
    setPage('game');
  }, []);

  const handlePlaceStone = useCallback((x: number, y: number) => {
    if (!engine || isAiThinking) return;

    if (engine.currentPlayer !== gameConfig.playerColor && gameConfig.aiType === 'local') {
      return;
    }

    const success = engine.play(x, y);
    if (!success) return;

    const newHistory = [...moveHistory, `${String.fromCharCode(65 + x)}${engine.size - y}`];
    setMoveHistory(newHistory);
    setEngine(engine.clone());

    if (gameConfig.aiType === 'local' && ai) {
      setIsAiThinking(true);
      setTimeout(() => {
        const aiMove = ai.getMove(engine);
        if ('pass' in aiMove) {
          engine.pass();
          setGameMessage('AI 选择跳过');
        } else {
          engine.play(aiMove.x, aiMove.y);
          const aiCoord = `${String.fromCharCode(65 + aiMove.x)}${engine.size - aiMove.y}`;
          setMoveHistory(prev => [...prev, aiCoord]);
        }
        setEngine(engine.clone());
        setIsAiThinking(false);
      }, 500);
    }
  }, [engine, gameConfig, ai, isAiThinking, moveHistory]);

  const handlePass = useCallback(() => {
    if (!engine || isAiThinking) return;
    engine.pass();
    setEngine(engine.clone());

    if (gameConfig.aiType === 'local' && ai) {
      setIsAiThinking(true);
      setTimeout(() => {
        const aiMove = ai.getMove(engine);
        if ('pass' in aiMove) {
          engine.pass();
          setGameMessage('双方连续跳过，对局结束');
        } else {
          engine.play(aiMove.x, aiMove.y);
        }
        setEngine(engine.clone());
        setIsAiThinking(false);
      }, 500);
    }
  }, [engine, gameConfig, ai, isAiThinking]);

  const handleUndo = useCallback(() => {
    if (!engine || isAiThinking || moveHistory.length < 2) return;
    engine.undo();
    engine.undo();
    setMoveHistory(prev => prev.slice(0, -2));
    setEngine(engine.clone());
  }, [engine, isAiThinking, moveHistory]);

  const handleResign = useCallback(() => {
    if (!engine) return;
    setGameMessage('您已认输');
  }, [engine]);

  const resetGame = useCallback(() => {
    if (!engine) return;
    engine.reset();
    setEngine(engine.clone());
    setMoveHistory([]);
    setGameMessage('');
  }, [engine]);

  const renderHome = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f5f0e8 0%, #e8e0d5 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 20px',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            background: 'radial-gradient(circle at 35% 35%, #444, #111)',
            borderRadius: '50%',
            top: '5px',
            left: '5px',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.4)'
          }} />
          <div style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            background: 'radial-gradient(circle at 40% 40%, #fff, #ddd)',
            borderRadius: '50%',
            bottom: '5px',
            right: '5px',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.2)'
          }} />
        </div>
        <h1 style={{
          fontFamily: "'Noto Serif SC', serif",
          fontSize: '2.5rem',
          color: '#2C2C2C',
          marginBottom: '8px'
        }}>
          围棋对弈
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          传承千年智慧，体验棋道精髓
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '320px' }}>
        <button
          onClick={() => setPage('setup')}
          style={{
            padding: '16px 32px',
            fontSize: '1.1rem',
            background: '#2C1810',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          🤖 人机对弈
        </button>
        <button
          onClick={() => startGame({ ...gameConfig, aiType: 'local', aiLevel: 'medium' })}
          style={{
            padding: '16px 32px',
            fontSize: '1.1rem',
            background: '#C4A574',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          👥 本地对弈
        </button>
        <button
          onClick={() => setPage('settings')}
          style={{
            padding: '16px 32px',
            fontSize: '1.1rem',
            background: '#f5f5f5',
            color: '#333',
            border: '2px solid #ddd',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          ⚙️ 设置
        </button>
      </div>
    </div>
  );

  const renderSetup = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f5f0e8 0%, #e8e0d5 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <button
            onClick={() => setPage('home')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              marginRight: '16px'
            }}
          >
            ←
          </button>
          <h1 style={{ fontFamily: "'Noto Serif SC', serif", fontSize: '1.5rem' }}>
            对局设置
          </h1>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>棋盘大小</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[9, 13, 19].map(size => (
              <button
                key={size}
                onClick={() => setGameConfig(prev => ({ ...prev, boardSize: size }))}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: `2px solid ${gameConfig.boardSize === size ? '#C4A574' : '#eee'}`,
                  background: gameConfig.boardSize === size ? '#f5f0e8' : 'white',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: gameConfig.boardSize === size ? 700 : 400
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{size}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  {size === 9 ? '入门' : size === 13 ? '进阶' : '标准'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>执子颜色</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setGameConfig(prev => ({ ...prev, playerColor: BLACK }))}
              style={{
                flex: 1,
                padding: '16px',
                border: `2px solid ${gameConfig.playerColor === BLACK ? '#C4A574' : '#eee'}`,
                background: gameConfig.playerColor === BLACK ? '#f5f0e8' : 'white',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #444, #111)' }} />
              黑棋先行
            </button>
            <button
              onClick={() => setGameConfig(prev => ({ ...prev, playerColor: WHITE }))}
              style={{
                flex: 1,
                padding: '16px',
                border: `2px solid ${gameConfig.playerColor === WHITE ? '#C4A574' : '#eee'}`,
                background: gameConfig.playerColor === WHITE ? '#f5f0e8' : 'white',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #fff, #ddd)', border: '1px solid #ccc' }} />
              白棋后行
            </button>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>AI 难度</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { key: 'easy', name: '初级', desc: '适合新手' },
              { key: 'medium', name: '中级', desc: '有一定挑战' },
              { key: 'hard', name: '高级', desc: '棋力较强' }
            ].map(level => (
              <button
                key={level.key}
                onClick={() => setGameConfig(prev => ({ ...prev, aiLevel: level.key as 'easy' | 'medium' | 'hard' }))}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: `2px solid ${gameConfig.aiLevel === level.key ? '#C4A574' : '#eee'}`,
                  background: gameConfig.aiLevel === level.key ? '#f5f0e8' : 'white',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700 }}>{level.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>{level.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => startGame(gameConfig)}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '1.1rem',
            background: '#2C1810',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          开始对弈
        </button>
      </div>
    </div>
  );

  const renderGame = () => {
    if (!engine) return null;
    const state = engine.getState();

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f5f0e8 0%, #e8e0d5 100%)',
        padding: '16px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <button
              onClick={() => setPage('home')}
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ←
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>黑棋提子</div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{state.capturedByBlack}</div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: state.currentPlayer === BLACK
                  ? 'radial-gradient(circle at 30% 30%, #444, #111)'
                  : 'radial-gradient(circle at 30% 30%, #fff, #ddd)',
                border: state.currentPlayer === WHITE ? '2px solid #ccc' : 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isAiThinking && <div style={{ width: '16px', height: '16px', border: '2px solid #ccc', borderTopColor: '#666', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>白棋提子</div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{state.capturedByWhite}</div>
              </div>
            </div>
            <div style={{ width: '40px' }} />
          </div>

          {gameMessage && (
            <div style={{
              padding: '12px',
              background: '#FFF3E0',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center',
              color: '#E65100'
            }}>
              {gameMessage}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Board
              size={engine.size}
              board={state.board}
              lastMove={state.lastMove}
              theme={theme}
              onPlaceStone={handlePlaceStone}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <button onClick={handlePass} style={{
              padding: '12px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500
            }}>
              跳过
            </button>
            <button onClick={handleUndo} style={{
              padding: '12px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500
            }}>
              悔棋
            </button>
            <button onClick={resetGame} style={{
              padding: '12px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500
            }}>
              重新开始
            </button>
            <button onClick={handleResign} style={{
              padding: '12px',
              background: '#FFEBEE',
              border: '1px solid #EF9A9A',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              color: '#C62828'
            }}>
              认输
            </button>
          </div>

          {moveHistory.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px',
              maxHeight: '150px',
              overflow: 'auto'
            }}>
              <h4 style={{ marginBottom: '8px', fontSize: '0.9rem' }}>棋谱记录</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {moveHistory.map((move, i) => (
                  <span key={i} style={{
                    padding: '2px 6px',
                    background: i % 2 === 0 ? '#f5f5f5' : '#fff',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    {i + 1}. {move}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f5f0e8 0%, #e8e0d5 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <button
            onClick={() => setPage('home')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              marginRight: '16px'
            }}
          >
            ←
          </button>
          <h1 style={{ fontFamily: "'Noto Serif SC', serif", fontSize: '1.5rem' }}>
            设置
          </h1>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>棋盘主题</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {(Object.keys(THEMES) as ThemeName[]).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  padding: '16px',
                  border: `2px solid ${theme === t ? '#C4A574' : '#eee'}`,
                  background: theme === t ? '#f5f0e8' : 'white',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{THEMES[t].icon}</span>
                <span style={{ fontWeight: theme === t ? 700 : 400 }}>{THEMES[t].name}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '8px',
            background: `linear-gradient(145deg, ${THEMES[theme].boardColorLight} 0%, ${THEMES[theme].boardColor} 50%, ${THEMES[theme].boardColorDark} 100%)`
          }} />
          <div>
            <div style={{ fontWeight: 700 }}>{THEMES[theme].name}</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>当前预览</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      {page === 'home' && renderHome()}
      {page === 'setup' && renderSetup()}
      {page === 'game' && renderGame()}
      {page === 'settings' && renderSettings()}
    </>
  );
};

export default App;
