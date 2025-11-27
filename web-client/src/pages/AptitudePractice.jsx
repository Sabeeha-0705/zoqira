import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'
import { aptitudeService } from '../services/aptitude.service'

const categoryOptions = [
  { label: 'All Categories', value: '' },
  { label: 'Quantitative', value: 'Quantitative' },
  { label: 'Logical', value: 'Logical' },
  { label: 'Verbal', value: 'Verbal' }
]

const difficultyOptions = [
  { label: 'All Difficulties', value: '' },
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' }
]

const AptitudePractice = () => {
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [stats, setStats] = useState({ attempted: 0, correct: 0 })
  const [showSummary, setShowSummary] = useState(false)
  const [attemptSaved, setAttemptSaved] = useState(false)
  const [userStats, setUserStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState('')

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    setError('')
    setShowSummary(false)
    setSelectedOption(null)
    setAnswered(false)
    setCurrentIndex(0)
    setStats({ attempted: 0, correct: 0 })
    setAttemptSaved(false)

    try {
      const params = {}
      if (category) params.category = category
      if (difficulty) params.difficulty = difficulty

      const { data } = await api.get('/aptitude', { params })
      setQuestions(data?.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load aptitude questions')
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }, [category, difficulty])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const fetchUserStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      setStatsError('')
      const data = await aptitudeService.getMyStats()
      setUserStats(data)
    } catch (err) {
      setStatsError(err.response?.data?.message || 'Failed to load your aptitude stats')
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserStats()
  }, [fetchUserStats])

  useEffect(() => {
    const shouldPost = showSummary && !attemptSaved && questions.length > 0
    if (!shouldPost) return

    const resolvedCategory = category || 'Mixed'
    const resolvedDifficulty = difficulty || 'mixed'

    const postAttempt = async () => {
      try {
        await aptitudeService.saveAttempt({
          category: resolvedCategory,
          difficulty: resolvedDifficulty,
          correctCount: stats.correct,
          totalCount: questions.length,
        })
        setAttemptSaved(true)
        fetchUserStats()
      } catch (err) {
        console.error('Failed to save aptitude attempt', err)
      }
    }

    postAttempt()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSummary, attemptSaved, stats.correct, questions.length, category, difficulty])

  const currentQuestion = questions[currentIndex]

  const handleOptionClick = (index) => {
    if (answered || !currentQuestion) return
    setSelectedOption(index)
    setAnswered(true)
    setStats((prev) => ({
      attempted: prev.attempted + 1,
      correct: prev.correct + (index === currentQuestion.correctOptionIndex ? 1 : 0)
    }))
  }

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      setShowSummary(true)
      return
    }
    setCurrentIndex((prev) => prev + 1)
    setSelectedOption(null)
    setAnswered(false)
  }

  const handleRestart = () => {
    setShowSummary(false)
    setCurrentIndex(0)
    setSelectedOption(null)
    setAnswered(false)
    setStats({ attempted: 0, correct: 0 })
  }

  const optionStyle = (index) => {
    const baseStyle = {
      padding: '0.85rem 1rem',
      borderRadius: '6px',
      border: '1px solid #ddd',
      cursor: answered ? 'default' : 'pointer',
      width: '100%',
      textAlign: 'left',
      backgroundColor: '#fff',
      transition: 'all 0.2s ease',
      fontSize: '1rem'
    }

    if (!answered || !currentQuestion) {
      return { ...baseStyle }
    }

    if (index === selectedOption) {
      const isCorrect = index === currentQuestion.correctOptionIndex
      return {
        ...baseStyle,
        backgroundColor: isCorrect ? '#4CAF50' : '#ff4d4f',
        color: '#fff',
        borderColor: isCorrect ? '#4CAF50' : '#ff4d4f'
      }
    }

    if (index === currentQuestion.correctOptionIndex) {
      return {
        ...baseStyle,
        borderColor: '#4CAF50',
        color: '#4CAF50'
      }
    }

    return { ...baseStyle, opacity: 0.8 }
  }

  const renderContent = () => {
    if (loading) {
      return <p style={styles.statusText}>Loading aptitude questions...</p>
    }

    if (error) {
      return <p style={{ ...styles.statusText, color: '#ff4d4f' }}>{error}</p>
    }

    if (!questions.length) {
      return <p style={styles.statusText}>No questions found for the selected filters.</p>
    }

    if (showSummary) {
      return (
        <div style={styles.summary}>
          <h2>Practice Summary</h2>
          <p>You answered {stats.correct}/{questions.length} correctly.</p>
          <button style={styles.primaryButton} onClick={handleRestart}>
            Restart Practice
          </button>

          <div style={styles.userStatsSection}>
            <h3>Your Stats</h3>
            {statsLoading && <p style={styles.statusText}>Loading your stats...</p>}
            {statsError && <p style={{ ...styles.statusText, color: '#ff4d4f' }}>{statsError}</p>}
            {userStats && !statsLoading && !statsError && (
              <>
                <p>Total attempts: {userStats.stats?.totalAttempts || 0}</p>
                <p>Overall accuracy: {userStats.stats?.accuracy ?? 0}%</p>
                {userStats.attempts?.length > 0 && (
                  <div style={styles.attemptsList}>
                    <h4>Recent attempts</h4>
                    {userStats.attempts.map((attempt) => (
                      <div key={attempt._id || attempt.id} style={styles.attemptItem}>
                        <span>{attempt.category} • {attempt.difficulty}</span>
                        <span>{attempt.correctCount}/{attempt.totalCount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )
    }

    return (
      <>
        <div style={styles.questionHeader}>
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{currentQuestion.category} &bull; {currentQuestion.difficulty}</span>
        </div>
        <h2 style={styles.questionText}>{currentQuestion.question}</h2>
        <div style={styles.options}>
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              style={optionStyle(idx)}
              onClick={() => handleOptionClick(idx)}
              disabled={answered}
            >
              {option}
            </button>
          ))}
        </div>
        {answered && (
          <div style={styles.explanation}>
            <strong>{selectedOption === currentQuestion.correctOptionIndex ? 'Great job!' : 'Explanation:'}</strong>
            <p>{currentQuestion.explanation || 'No explanation provided.'}</p>
          </div>
        )}
        <div style={styles.actions}>
          <button
            style={{ ...styles.primaryButton, opacity: answered ? 1 : 0.6 }}
            onClick={handleNext}
            disabled={!answered}
          >
            {currentIndex === questions.length - 1 ? 'Finish Practice' : 'Next Question'}
          </button>
        </div>
        <div style={styles.stats}>
          <span>Attempted: {stats.attempted}</span>
          <span>Correct: {stats.correct}</span>
        </div>
      </>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Aptitude Practice</h1>
            <p style={styles.subtitle}>Sharpen your skills across Quantitative, Logical, and Verbal topics.</p>
          </div>
          <div style={styles.filters}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
            >
              {categoryOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={styles.select}
            >
              {difficultyOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>{option.label}</option>
              ))}
            </select>
            <button style={styles.secondaryButton} onClick={fetchQuestions}>
              Refresh
            </button>
          </div>
        </div>
        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    padding: '2.5rem'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#666'
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  select: {
    padding: '0.6rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    minWidth: '160px'
  },
  secondaryButton: {
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    border: '1px solid #1a1a1a',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#666',
    fontWeight: '500'
  },
  questionText: {
    fontSize: '1.5rem',
    lineHeight: 1.4
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  explanation: {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    borderRadius: '6px'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  primaryButton: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.8rem 1.5rem',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  stats: {
    display: 'flex',
    gap: '1.5rem',
    color: '#666',
    fontWeight: '500'
  },
  statusText: {
    textAlign: 'center',
    color: '#666'
  },
  summary: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  userStatsSection: {
    marginTop: '2rem',
    textAlign: 'left'
  },
  attemptsList: {
    marginTop: '0.75rem',
    borderTop: '1px solid #eee',
    paddingTop: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  attemptItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#555'
  }
}

export default AptitudePractice

