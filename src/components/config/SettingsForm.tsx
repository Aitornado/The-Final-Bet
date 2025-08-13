'use client'

import { useState } from 'react'
import { ExtensionSettings } from '@/types/config'

interface SettingsFormProps {
  settings: ExtensionSettings
  onSaveSettings: (settings: ExtensionSettings) => void
}

export default function SettingsForm({ settings, onSaveSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState<ExtensionSettings>(settings)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (field: keyof ExtensionSettings, value: string | number) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    setHasChanges(JSON.stringify(newData) !== JSON.stringify(settings))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSaveSettings(formData)
    setHasChanges(false)
  }

  const handleReset = () => {
    const defaultSettings: ExtensionSettings = {
      minBits: 1,
      maxBits: 10000,
      autoResolve: 'manual',
      predictionTimeout: 300
    }
    setFormData(defaultSettings)
    setHasChanges(JSON.stringify(defaultSettings) !== JSON.stringify(settings))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Minimum Bits */}
        <div>
          <label htmlFor="min-bits" className="block text-sm font-medium text-gray-300 mb-2">
            Minimum Bits per Bet
          </label>
          <input
            type="number"
            id="min-bits"
            value={formData.minBits}
            onChange={(e) => handleChange('minBits', parseInt(e.target.value) || 1)}
            min="1"
            max="1000"
            className="form-input"
          />
          <div className="text-xs text-gray-500 mt-1">
            Minimum: 1, Maximum: 1000
          </div>
        </div>

        {/* Maximum Bits */}
        <div>
          <label htmlFor="max-bits" className="block text-sm font-medium text-gray-300 mb-2">
            Maximum Bits per Bet
          </label>
          <input
            type="number"
            id="max-bits"
            value={formData.maxBits}
            onChange={(e) => handleChange('maxBits', parseInt(e.target.value) || 10000)}
            min="1"
            max="10000"
            className="form-input"
          />
          <div className="text-xs text-gray-500 mt-1">
            Minimum: 1, Maximum: 10000
          </div>
        </div>

        {/* Auto Resolve */}
        <div>
          <label htmlFor="auto-resolve" className="block text-sm font-medium text-gray-300 mb-2">
            Prediction Resolution
          </label>
          <select
            id="auto-resolve"
            value={formData.autoResolve}
            onChange={(e) => handleChange('autoResolve', e.target.value as 'manual' | 'timer')}
            className="form-select"
          >
            <option value="manual">Manual Resolution</option>
            <option value="timer">Auto-resolve on Timer</option>
          </select>
          <div className="text-xs text-gray-500 mt-1">
            Manual gives you full control over when to resolve
          </div>
        </div>

        {/* Prediction Timeout */}
        <div>
          <label htmlFor="prediction-timeout" className="block text-sm font-medium text-gray-300 mb-2">
            Betting Window Duration (seconds)
          </label>
          <input
            type="number"
            id="prediction-timeout"
            value={formData.predictionTimeout}
            onChange={(e) => handleChange('predictionTimeout', parseInt(e.target.value) || 300)}
            min="30"
            max="1800"
            step="30"
            className="form-input"
          />
          <div className="text-xs text-gray-500 mt-1">
            {Math.floor(formData.predictionTimeout / 60)}m {formData.predictionTimeout % 60}s
            (Min: 30s, Max: 30m)
          </div>
        </div>
      </div>

      {/* Validation Warnings */}
      {formData.minBits >= formData.maxBits && (
        <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-3">
          <p className="text-yellow-400 text-sm">
            ⚠️ Minimum bits must be less than maximum bits
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!hasChanges || formData.minBits >= formData.maxBits}
          className="btn btn-primary px-6 py-2"
        >
          Save Settings
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          className="btn btn-secondary px-4 py-2"
        >
          Reset to Defaults
        </button>
      </div>

      {hasChanges && (
        <p className="text-sm text-blue-400">
          💡 You have unsaved changes
        </p>
      )}
    </form>
  )
}