import api from './api'

export const aptitudeService = {
  saveAttempt: async ({ category, difficulty, correctCount, totalCount }) => {
    const response = await api.post('/aptitude/attempt', {
      category,
      difficulty,
      correctCount,
      totalCount,
    })
    return response.data
  },

  getMyStats: async () => {
    const response = await api.get('/aptitude/stats/me')
    return response.data
  },
}