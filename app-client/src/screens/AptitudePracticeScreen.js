import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import api from '../services/api';

const CATEGORY_FILTERS = ['All', 'Quantitative', 'Logical', 'Verbal'];
const DIFFICULTY_FILTERS = ['All', 'easy', 'medium', 'hard'];

const AptitudePracticeScreen = () => {
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [stats, setStats] = useState({ attempted: 0, correct: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [attemptSaved, setAttemptSaved] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      setQuestions([]);
      setCurrentIndex(0);
      setSelectedOption(null);
      setAnswered(false);
      setStats({ attempted: 0, correct: 0 });
      setShowSummary(false);
      setAttemptSaved(false);

      const params = {};
      if (category !== 'All') params.category = category;
      if (difficulty !== 'All') params.difficulty = difficulty;

      const { data } = await api.get('/aptitude', { params });
      setQuestions(data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load aptitude questions right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, difficulty]);

  useEffect(() => {
    const shouldPost = showSummary && !attemptSaved && questions.length > 0;
    if (!shouldPost) return;

    const resolvedCategory = category === 'All' ? 'Mixed' : category;
    const resolvedDifficulty = difficulty === 'All' ? 'mixed' : difficulty;

    const postAttempt = async () => {
      try {
        await api.post('/aptitude/attempt', {
          category: resolvedCategory,
          difficulty: resolvedDifficulty,
          correctCount: stats.correct,
          totalCount: questions.length,
        });
        setAttemptSaved(true);
      } catch (err) {
        console.log('Failed to save aptitude attempt', err.message);
      }
    };

    postAttempt();
  }, [showSummary, attemptSaved, questions.length, stats.correct, category, difficulty]);

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  const handleOptionPress = (optionIndex) => {
    if (answered || !currentQuestion) {
      return;
    }
    setSelectedOption(optionIndex);
    setAnswered(true);
    setStats((prev) => ({
      attempted: prev.attempted + 1,
      correct: prev.correct + (optionIndex === currentQuestion.correctOptionIndex ? 1 : 0)
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex === questions.length - 1) {
      setShowSummary(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setAnswered(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setStats({ attempted: 0, correct: 0 });
    setShowSummary(false);
  };

  const renderOptionStyle = (index) => {
    let base = styles.option;
    if (!answered || !currentQuestion) {
      return base;
    }
    const isCorrect = index === currentQuestion.correctOptionIndex;
    const isSelected = index === selectedOption;

    if (isSelected && isCorrect) {
      return [base, styles.optionCorrect];
    }

    if (isSelected && !isCorrect) {
      return [base, styles.optionIncorrect];
    }

    if (!isSelected && isCorrect) {
      return [base, styles.optionOutlineCorrect];
    }

    return [base, styles.optionDisabled];
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color="#1a1a1a" />
          <Text style={styles.stateText}>Loading aptitude questions...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centeredState}>
          <Text style={[styles.stateText, { color: '#e63946' }]}>{error}</Text>
          <Pressable style={[styles.primaryButton, { marginTop: 16 }]} onPress={fetchQuestions}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    if (!questions.length) {
      return (
        <View style={styles.centeredState}>
          <Text style={styles.stateText}>No questions found for selected filters.</Text>
        </View>
      );
    }

    if (showSummary) {
      return (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Practice Summary</Text>
          <Text style={styles.summaryScore}>
            You answered {stats.correct}/{questions.length} correctly
          </Text>
          <Pressable style={styles.primaryButton} onPress={handleRestart}>
            <Text style={styles.primaryButtonText}>Restart Practice</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionMeta}>Question {currentIndex + 1} of {questions.length}</Text>
          <Text style={styles.questionMeta}>
            {currentQuestion.category} • {currentQuestion.difficulty}
          </Text>
        </View>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        <View style={{ marginTop: 20 }}>
          {currentQuestion.options.map((option, index) => (
            <Pressable
              key={index}
              style={renderOptionStyle(index)}
              onPress={() => handleOptionPress(index)}
            >
              <Text style={[
                styles.optionText,
                (answered && index === currentQuestion.correctOptionIndex) && styles.optionTextCorrect,
                (answered && index === selectedOption && index !== currentQuestion.correctOptionIndex) && styles.optionTextIncorrect
              ]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        {answered && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>
              {selectedOption === currentQuestion.correctOptionIndex ? 'Correct!' : 'Explanation'}
            </Text>
            <Text style={styles.explanationText}>
              {currentQuestion.explanation || 'No explanation available.'}
            </Text>
          </View>
        )}

        <Pressable
          style={[styles.primaryButton, { opacity: answered ? 1 : 0.6, marginTop: 24 }]}
          disabled={!answered}
          onPress={handleNextQuestion}
        >
          <Text style={styles.primaryButtonText}>
            {currentIndex === questions.length - 1 ? 'Finish Practice' : 'Next Question'}
          </Text>
        </Pressable>

        <View style={styles.statsRow}>
          <Text style={styles.statsText}>Attempted: {stats.attempted}</Text>
          <Text style={styles.statsText}>Correct: {stats.correct}</Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {CATEGORY_FILTERS.map((label) => (
          <Pressable
            key={label}
            style={[styles.filterChip, category === label && styles.filterChipActive]}
            onPress={() => setCategory(label)}
          >
            <Text style={[
              styles.filterChipText,
              category === label && styles.filterChipTextActive
            ]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.filterRow}>
        {DIFFICULTY_FILTERS.map((label) => (
          <Pressable
            key={label}
            style={[styles.filterChip, difficulty === label && styles.filterChipActive]}
            onPress={() => setDifficulty(label)}
          >
            <Text style={[
              styles.filterChipText,
              difficulty === label && styles.filterChipTextActive
            ]}>
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.card}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  centeredState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  stateText: {
    marginTop: 12,
    color: '#666',
    textAlign: 'center'
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  questionMeta: {
    color: '#777',
    fontSize: 14,
    fontWeight: '600'
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    lineHeight: 28,
    color: '#111'
  },
  option: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  optionText: {
    fontSize: 16,
    color: '#111'
  },
  optionCorrect: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32'
  },
  optionIncorrect: {
    backgroundColor: '#d32f2f',
    borderColor: '#d32f2f'
  },
  optionOutlineCorrect: {
    borderColor: '#2e7d32'
  },
  optionDisabled: {
    opacity: 0.8
  },
  optionTextCorrect: {
    color: '#fff'
  },
  optionTextIncorrect: {
    color: '#fff'
  },
  explanationBox: {
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 10,
    marginTop: 16
  },
  explanationTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6
  },
  explanationText: {
    color: '#444',
    lineHeight: 20
  },
  primaryButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  statsText: {
    color: '#555',
    fontWeight: '600'
  },
  summaryCard: {
    alignItems: 'center',
    gap: 12
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: '700'
  },
  summaryScore: {
    fontSize: 18,
    color: '#333'
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  filterChipActive: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a'
  },
  filterChipText: {
    color: '#333',
    fontWeight: '600'
  },
  filterChipTextActive: {
    color: '#fff'
  }
});

export default AptitudePracticeScreen;

