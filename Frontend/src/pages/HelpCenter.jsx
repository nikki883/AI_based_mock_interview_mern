import "./HelpCenter.css";

function HelpCenter() {
  return (
    <div className="help-container">
      <h1>Help Center</h1>
      <p>Find solutions to common issues and learn how to use AI Interview effectively.</p>

      <div className="help-section">
        <h3>🔑 Getting Started</h3>
        <p>Register, log in, and start practicing interviews instantly. No setup required.</p>
      </div>

      <div className="help-section">
        <h3>🎤 Microphone Issues</h3>
        <p>Make sure your browser has microphone access enabled. Restart and allow permissions.</p>
      </div>

      <div className="help-section">
        <h3>📊 Tracking Progress</h3>
        <p>Your results are saved in your dashboard after logging in.</p>
      </div>
    </div>
  );
}

export default HelpCenter;
