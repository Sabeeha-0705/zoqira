// Simple stubbed AI coach responses based on goal and context

const buildInterviewReply = (userMessage) => {
  return (
    "Great interview-style question. " +
    "Try to answer in 3–4 concise sentences, focusing on structure (situation, task, action, result). " +
    `For example, you might start with: "${userMessage.length > 0 ? 'In my previous experience, ' : 'In one of my projects, '}" and then describe a concrete example.`
  );
};

const buildGeneralReply = (userMessage) => {
  return (
    "Nice sentence! I'll give you feedback on clarity and correctness. " +
    "Try to speak slowly, emphasize key words, and avoid very long sentences. " +
    (userMessage
      ? ` One way to improve your last message is to add more detail. For example: "${userMessage} ... because ...".`
      : '')
  );
};

const buildTechnicalReply = (userMessage) => {
  return (
    "Good technical explanation. Focus on using precise terminology and clear step‑by‑step descriptions. " +
    "Imagine you are explaining this to a curious colleague. " +
    (userMessage ? " You can also practice by turning your explanation into a short story about a real project." : '')
  );
};

exports.generateCoachReply = ({ goal, context, userMessage }) => {
  const normalizedGoal = (goal || '').toLowerCase();
  const normalizedContext = (context || '').toLowerCase();

  if (normalizedGoal === 'interview' || normalizedContext === 'interview') {
    return buildInterviewReply(userMessage);
  }

  if (normalizedContext === 'technical') {
    return buildTechnicalReply(userMessage);
  }

  return buildGeneralReply(userMessage);
};


