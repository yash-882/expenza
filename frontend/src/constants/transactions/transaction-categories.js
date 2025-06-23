export const transactionCategories = [
  { id: 'food',        emoji: '🍽️' },
  { id: 'transport',   emoji: '🚌' },
  { id: 'housing',     emoji: '🏠' },
  { id: 'entertainment', emoji: '🎮'},
  { id: 'healthcare',  emoji: '💊' },
  { id: 'education',   emoji: '🎓' },
  { id: 'job',         emoji: '💼' },
  { id: 'freelance',   emoji: '💻' },
  { id: 'bonus',       emoji: '💰' },
  { id: 'other expense',  emoji: '' },
  { id: 'other income',  emoji: '' }
]

export const categoriesByType = {
  expense: ['food', 'transport', 'housing', 'entertainment', 'healthcare', 'education', 'other expense'],
  
  income: ['job', 'freelance', 'bonus', 'other income']
}
