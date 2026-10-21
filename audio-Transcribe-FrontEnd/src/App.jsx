
import AudioUploader from './AudioUploader'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <a href="/" className="brand">
          <img
            src="/audioscribe-logo.png"
            alt="AudioScribe logo"
            className="brand-logo"
          />
        </a>

        <div className="status">
          <span className="status-dot"></span>
          AI-powered transcription
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <span className="eyebrow">
            SPEECH TO TEXT, SIMPLIFIED
          </span>

          <h1>
            Your audio,
            <br />
            <span>turned into text.</span>
          </h1>

          <p>
            Convert your audio recordings into readable text
            with a simple, easy-to-use transcription tool.
          </p>
        </section>

        <section className="workspace">
          <AudioUploader />
        </section>

        <footer className="footer">
          Made for simple, hassle-free transcription.
        </footer>
      </main>
    </div>
  )
}

export default App
