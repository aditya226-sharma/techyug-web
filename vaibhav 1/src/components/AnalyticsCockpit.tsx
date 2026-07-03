import React, { useState, useEffect } from 'react';
import { Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { loadConfig } from '../services/configStore';

const SAFETY_PREDICTIONS = [
  {
    title: "Late Night Screen Activity Risk",
    status: "Normal",
    verdict: "Activity patterns match standard baseline rest parameters.",
    risk: "Low"
  },
  {
    title: "Toxic Vocabulary Trend Index",
    status: "Flagged",
    verdict: "BERT identified a 15% increase in defensive keyword usage this week.",
    risk: "Medium"
  },
  {
    title: "Stranger Conversation Exposure",
    status: "Secure",
    verdict: "Conversational partners verified against trust registries.",
    risk: "None"
  }
];

const QUIZ_QUESTIONS = [
  {
    question: "If an online contact asks you to 'keep our conversations a secret from your parents', what is this?",
    options: [
      "A normal gaming interaction helper",
      "An indicator of Grooming / Suspicious Behavior",
      "A standard privacy encryption setting"
    ],
    correct: 1,
    explain: "Groomers often demand child-parent secrecy to isolate the child. BalKavach flags secrecy phrases instantly."
  },
  {
    question: "What is the best way to handle suspicious links offering 'free Robux or game skins'?",
    options: [
      "Enter account details to test if it is valid",
      "Ignore it and report the phishing vector to parent/teacher",
      "Share it with friends so they can win too"
    ],
    correct: 1,
    explain: "These are typical phishing techniques designed to steal parent credentials or drop malware vectors."
  }
];

export const AnalyticsCockpit: React.FC = () => {
  const [activeAlertCount, setActiveAlertCount] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      const config = loadConfig();
      const count = config.alerts.filter(a => !a.read).length;
      setActiveAlertCount(count);
    };
    handleUpdate();
    window.addEventListener("balkavach-config-update", handleUpdate);
    return () => window.removeEventListener("balkavach-config-update", handleUpdate);
  }, []);

  const calculateSafetyScore = () => {
    // 96 base, subtract 20 per active alert
    return Math.max(15, 96 - activeAlertCount * 22);
  };

  const currentScore = calculateSafetyScore();

  const handleQuizAnswer = (idx: number) => {
    if (showAnswer) return;
    setSelectedOption(idx);
    setShowAnswer(true);
    if (idx === QUIZ_QUESTIONS[quizIndex].correct) {
      setScoreCount(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setQuizIndex((quizIndex + 1) % QUIZ_QUESTIONS.length);
  };

  return (
    <div className="analytics-learning-cockpit" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
      
      {/* SECTION 1: Safety Score & Behavior Predictions */}
      <div className="hud-card glass-panel flex-col" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card-header">
          <div className="icon-container accent">
            <Award className="glow-icon" />
          </div>
          <div>
            <h3>Parent Safety Cockpit</h3>
            <span className="card-subtitle">AI Risk Assessments & Behavior Predictions</span>
          </div>
        </div>

        {/* Big Score Radial UI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
          <div className="risk-dial" style={{ 
            width: '84px', 
            height: '84px', 
            border: `4px solid ${currentScore > 75 ? '#05f2c7' : currentScore > 40 ? '#f59e0b' : '#ff0055'}`,
            boxShadow: `0 0 10px ${currentScore > 75 ? 'rgba(5,242,199,0.2)' : currentScore > 40 ? 'rgba(245,158,11,0.2)' : 'rgba(255,0,85,0.2)'}`
          }}>
            <span className="dial-value" style={{ fontSize: '24px' }}>{currentScore}</span>
            <span className="dial-label" style={{ fontSize: '7px' }}>SAFETY INDEX</span>
          </div>
          <div>
            <h5 style={{ fontFamily: 'var(--font-hud)', fontSize: '13px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Safety Verdict</h5>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
              {currentScore > 75 
                ? "Your child's cyberspace matches high safety baselines. No anomalous threats active."
                : currentScore > 40 
                ? "Warning. Suspicious language patterns or phishing records flagged in the alert timeline."
                : "Action Needed. Critical online threats require immediate parental review in the app."}
            </p>
          </div>
        </div>

        {/* Predictions list */}
        <div className="predictions-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span className="preset-title" style={{ fontSize: '11px' }}>AI Safety Predictions & Routine Audits:</span>
          {SAFETY_PREDICTIONS.map((p, idx) => (
            <div key={idx} className="campus-node" style={{ padding: '10px 14px', cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{p.title}</span>
                <span style={{ 
                  fontSize: '9px', 
                  fontFamily: 'var(--font-hud)', 
                  fontWeight: 'bold', 
                  color: p.risk === 'Low' || p.risk === 'None' ? 'var(--color-accent)' : 'var(--color-danger)',
                  border: `1px solid ${p.risk === 'Low' || p.risk === 'None' ? 'var(--color-accent)' : 'var(--color-danger)'}`,
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {p.status}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '6px', lineHeight: '1.3' }}>{p.verdict}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Cyber Safety Learning Hub (Interactive Quiz) */}
      <div className="hud-card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card-header">
          <div className="icon-container primary">
            <BookOpen className="glow-icon" />
          </div>
          <div>
            <h3>Safety Learning Hub</h3>
            <span className="card-subtitle">Test Your Digital Knowledge Matrix</span>
          </div>
        </div>

        <div className="learning-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          <div className="quiz-question-box" style={{ background: 'rgba(0,0,0,0.15)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="info-label" style={{ fontSize: '10px' }}>QUESTION {quizIndex + 1} OF {QUIZ_QUESTIONS.length}</span>
              <span className="info-label" style={{ color: 'var(--color-accent)' }}>Score: {scoreCount}</span>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 'bold', lineHeight: '1.4' }}>
              {QUIZ_QUESTIONS[quizIndex].question}
            </p>
          </div>

          <div className="quiz-options-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {QUIZ_QUESTIONS[quizIndex].options.map((opt, oIdx) => {
              const isSelected = selectedOption === oIdx;
              const isCorrect = oIdx === QUIZ_QUESTIONS[quizIndex].correct;
              
              let btnClass = "";
              if (showAnswer) {
                if (isCorrect) btnClass = "correct-opt";
                else if (isSelected) btnClass = "incorrect-opt";
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleQuizAnswer(oIdx)}
                  disabled={showAnswer}
                  className={`quiz-opt-btn ${isSelected ? 'selected' : ''} ${btnClass}`}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    background: isSelected ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.01)',
                    border: isSelected 
                      ? '1px solid var(--color-primary)' 
                      : showAnswer && isCorrect 
                      ? '1px solid var(--color-accent)'
                      : showAnswer && isSelected
                      ? '1px solid var(--color-danger)'
                      : '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      width: '18px', 
                      height: '18px', 
                      borderRadius: '50%', 
                      border: '1px solid currentColor', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '10px'
                    }}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    {opt}
                  </div>
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <div className="answer-explanation-panel animated-fade-in" style={{ padding: '12px', borderRadius: '6px', background: 'rgba(5, 242, 199, 0.02)', border: '1px solid rgba(5, 242, 199, 0.1)', display: 'flex', gap: '10px' }}>
              <CheckCircle2 color="var(--color-accent)" size={18} style={{ flexShrink: 0 }} />
              <div>
                <h6 style={{ fontSize: '11px', color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: 'bold' }}>AI Educational Explanation:</h6>
                <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                  {QUIZ_QUESTIONS[quizIndex].explain}
                </p>
                <button onClick={handleNextQuiz} className="acknowledge-btn" style={{ marginTop: '10px', color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>
                  Next Question
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};
