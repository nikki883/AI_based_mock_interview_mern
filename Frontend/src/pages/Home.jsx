import heroImage from "../assets/hero.png";
import speackImage from "../assets/speack.png";
import "./Home.css";

function Home() {
  return (
    <div className="home-landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>PrepAI – Your AI-Based Interview Platform</h1>
          <p>
            Practice interviews with AI-driven feedback. Improve your
            communication, confidence, and vocabulary through real-time
            evaluations.
          </p>
          <div className="hero-buttons">
            <a href="/department" className="btn-primary">Get Started</a>
            <a href="/learn-more" className="btn-secondary">Learn More</a>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="AI Interview Illustration" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why PrepAI?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Department-based Questions</h3>
            <p>Choose your department/subject and get tailored interview questions.</p>
          </div>
          <div className="feature-card">
            <h3>AI Evaluation</h3>
            <p>Powered by Google Gemini API for smart and adaptive assessments.</p>
          </div>
          <div className="feature-card">
            <h3>Track Your Progress</h3>
            <p>Get detailed results to identify your strengths and weaknesses.</p>
          </div>
        </div>
      </section>

      {/* Speech Feature Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Speak Your Answers with Confidence</h2>
          <p>
            Use our speech-to-text feature to practice answering aloud. The AI
            evaluates your pronunciation, confidence, and vocabulary to give you
            real-world interview readiness.
          </p>
        </div>
        <div className="hero-image">
          <img src={speackImage} alt="Speech Feature" />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <h2>Start Your AI Interview Journey Today!</h2>
        <a href="/department" className="btn-primary">Get Started</a>
      </section>
    </div>
  );
}

export default Home;
