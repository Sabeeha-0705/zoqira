import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function AptitudeStatsScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/aptitude/stats/me');
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a1a1a" />
        <Text style={styles.stateText}>Loading your aptitude stats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.stateText, { color: '#d32f2f' }]}>{error}</Text>
      </View>
    );
  }

  const stats = data?.stats || { totalAttempts: 0, totalCorrect: 0, totalQuestions: 0, accuracy: 0 };
  const attempts = data?.attempts || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Your Aptitude Stats</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total attempts</Text>
          <Text style={styles.value}>{stats.totalAttempts}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total correct</Text>
          <Text style={styles.value}>{stats.totalCorrect}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total questions</Text>
          <Text style={styles.value}>{stats.totalQuestions}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Overall accuracy</Text>
          <Text style={styles.value}>{stats.accuracy}%</Text>
        </View>
      </View>

      {attempts.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.subtitle}>Recent Attempts</Text>
          {attempts.map((attempt) => (
            <View key={attempt._id || attempt.id} style={styles.attemptRow}>
              <View>
                <Text style={styles.attemptMain}>{attempt.category} • {attempt.difficulty}</Text>
                <Text style={styles.attemptSub}>{new Date(attempt.createdAt).toLocaleString()}</Text>
              </View>
              <Text style={styles.attemptScore}>{attempt.correctCount}/{attempt.totalCount}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  stateText: {
    marginTop: 12,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#555',
  },
  value: {
    fontWeight: '600',
    color: '#111',
  },
  attemptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  attemptMain: {
    fontWeight: '600',
  },
  attemptSub: {
    color: '#777',
    fontSize: 12,
    marginTop: 2,
  },
  attemptScore: {
    fontWeight: '700',
    color: '#1a1a1a',
  },
});