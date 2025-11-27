import api from './api'

export const communicationService = {
  getProfile: async () => {
    const res = await api.get('/communication/profile/me')
    return res.data
  },

  updateProfile: async (payload) => {
    const res = await api.put('/communication/profile/me', payload)
    return res.data
  },

  getConversations: async () => {
    const res = await api.get('/communication/conversations')
    return res.data
  },

  startConversation: async (context) => {
    const res = await api.post('/communication/conversations', { context })
    return res.data
  },

  sendMessage: async (conversationId, content) => {
    const res = await api.post(`/communication/conversations/${conversationId}/message`, { content })
    return res.data
  },
}


