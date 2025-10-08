import "./FAQ.css";

function FAQ() {
  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>

      <div className="faq-item">
        <h3>🤔 What is AI Interview?</h3>
        <p>
          AI Interview is a platform that helps you prepare for real interviews 
          using AI-powered feedback on your answers, vocabulary, and confidence.
        </p>
      </div>

      <div className="faq-item">
        <h3>💡 How does it evaluate my answers?</h3>
        <p>
          Our AI listens to your responses, checks for fluency, vocabulary, 
          confidence, and clarity, and then provides instant feedback.
        </p>
      </div>

      <div className="faq-item">
        <h3>🔐 Do I need an account?</h3>
        <p>
          Yes, you need to register and log in to access personalized interview 
          simulations and track your progress.
        </p>
      </div>

      <div className="faq-item">
        <h3>💳 Is it free?</h3>
        <p>
          You can try basic interviews for free. Advanced features may require 
          a subscription in the future.
        </p>
      </div>
    </div>
  );
}

export default FAQ;
