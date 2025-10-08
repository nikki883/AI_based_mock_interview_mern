import "./Blog.css";

function Blog() {
  return (
    <div className="blog-container">
      <h1>AI Interview Blog</h1>
      <p>Tips and tricks to ace your interviews, improve communication, and boost confidence.</p>

      <div className="blog-post">
        <h3>🚀 How AI is Changing Interview Preparation</h3>
        <p>AI gives you instant feedback on answers, tone, and vocabulary, making practice smarter.</p>
      </div>

      <div className="blog-post">
        <h3>🗣️ 5 Tips to Improve Your Speaking Confidence</h3>
        <p>Practice daily, maintain eye contact, and work on fluency to ace any interview.</p>
      </div>

      <div className="blog-post">
        <h3>📖 Vocabulary That Impresses Interviewers</h3>
        <p>Using precise words shows confidence. Replace fillers with powerful language.</p>
      </div>
    </div>
  );
}

export default Blog;
