'use client'

import { useState } from 'react'
import { PredictionTemplate } from '@/types/config'

interface PredictionFormProps {
  templates: PredictionTemplate[]
  onCreatePrediction: (question: string, template?: PredictionTemplate) => void
  disabled?: boolean
}

export default function PredictionForm({ templates, onCreatePrediction, disabled }: PredictionFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PredictionTemplate | null>(null)
  const [customQuestion, setCustomQuestion] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const question = customQuestion.trim() || selectedTemplate?.question
    if (!question) return

    onCreatePrediction(question, selectedTemplate || undefined)
    
    // Reset form
    setSelectedTemplate(null)
    setCustomQuestion('')
  }

  const handleTemplateSelect = (template: PredictionTemplate) => {
    setSelectedTemplate(template)
    setCustomQuestion(template.question)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Quick Templates
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleTemplateSelect(template)}
              className={`text-left p-3 rounded-lg border-2 transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-bet-red-500 bg-bet-red-500/10'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="font-medium text-white">{template.name}</div>
              <div className="text-sm text-gray-400 mt-1">{template.question}</div>
              <div className="text-xs text-gray-500 mt-2">
                {template.options.join(' vs ')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Question */}
      <div>
        <label htmlFor="prediction-question" className="block text-sm font-medium text-gray-300 mb-2">
          Prediction Question
        </label>
        <input
          type="text"
          id="prediction-question"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          className="form-input"
          placeholder="e.g., Will I win this match?"
          maxLength={100}
          required
        />
        <div className="text-xs text-gray-500 mt-1">
          {customQuestion.length}/100 characters
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={disabled || !customQuestion.trim()}
          className="btn btn-primary px-6 py-2"
        >
          Start Betting Window
        </button>
        
        {selectedTemplate && (
          <button
            type="button"
            onClick={() => {
              setSelectedTemplate(null)
              setCustomQuestion('')
            }}
            className="btn btn-secondary px-4 py-2"
          >
            Clear
          </button>
        )}
      </div>

      {disabled && (
        <p className="text-sm text-yellow-400">
          ⚠️ End or resolve the current prediction before starting a new one
        </p>
      )}
    </form>
  )
}