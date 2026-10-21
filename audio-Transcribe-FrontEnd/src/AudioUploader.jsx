
import { useRef, useState } from 'react'
import axios from 'axios'

const AudioUploader = () => {
  const [file, setFile] = useState(null)
  const [transcription, setTranscription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]

    if (selectedFile) {
      setFile(selectedFile)
      setTranscription('')
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an audio file first.')
      return
    }

    if (!API_URL) {
      setError('The backend URL is not configured.')
      return
    }

    setLoading(true)
    setError('')
    setTranscription('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(
        `${API_URL}/api/transcribe`,
        formData
      )

      setTranscription(response.data.transcription || '')
    } catch (err) {
      console.error('Transcription error:', err)
      setError(
        err.response?.data?.message ||
        'Unable to transcribe the audio. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const copyTranscription = async () => {
    if (!transcription) return

    try {
      await navigator.clipboard.writeText(transcription)
    } catch (err) {
      console.error('Could not copy transcription:', err)
      setError('Unable to copy text. Please select and copy it manually.')
    }
  }

  return (
    <div className="transcriber">
      <div className="section-heading">
        <div>
          <h2>Upload your audio</h2>
          <p>Choose a file to turn speech into text.</p>
        </div>
        <span className="step-number">01</span>
      </div>

      <div
        className={`drop-zone ${file ? 'has-file' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Choose an audio file"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="file-input"
        />

        <div className="upload-icon">
          {file ? '✓' : '↑'}
        </div>

        <h3>{file ? 'Audio file selected' : 'Drop your audio here'}</h3>

        <p className="drop-description">
          {file ? file.name : 'Or click to browse files on your device'}
        </p>

        <span className="browse-button">
          {file ? 'Choose another file' : 'Browse files'}
        </span>

        <p className="file-note">
          Supported formats depend on your backend configuration.
        </p>
      </div>

      {file && (
        <div className="selected-file">
          <div className="file-symbol">♫</div>
          <div className="file-details">
            <span className="file-name">{file.name}</span>
            <span className="file-size">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
          <button
            type="button"
            className="remove-file"
            onClick={() => {
              setFile(null)
              setTranscription('')
              setError('')
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
            aria-label="Remove selected file"
          >
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        className="transcribe-button"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner" />
            Transcribing audio...
          </>
        ) : (
          <>
            Transcribe audio <span aria-hidden="true">→</span>
          </>
        )}
      </button>

      {error && (
        <div className="error-message" role="alert">
          <span>!</span>
          {error}
        </div>
      )}

      <div className="transcript-section">
        <div className="transcript-heading">
          <div>
            <span className="section-label">YOUR RESULTS</span>
            <h2>Transcript</h2>
          </div>

          {transcription && (
            <button
              type="button"
              className="copy-button"
              onClick={copyTranscription}
            >
              Copy text
            </button>
          )}
        </div>

        <div
          className={`transcript-box ${transcription ? 'has-transcript' : ''}`}
          aria-live="polite"
        >
          {loading ? (
            <p className="placeholder-text">
              Your audio is being processed. Please wait...
            </p>
          ) : transcription ? (
            <p className="transcript-text">{transcription}</p>
          ) : (
            <div className="empty-transcript">
              <div className="transcript-icon">≡</div>
              <p>Your transcript will appear here.</p>
              <span>Upload an audio file to get started.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AudioUploader
