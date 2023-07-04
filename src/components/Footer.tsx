'use client'

export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-300 text-base-content fixed bottom-0 pt-4 pb-4">
      <div className="container">
        <span className="text-muted">
          Project can be found{" "}
          <a href="https://github.com/JianLoong/reddit-store">here</a> . This
          website updates itself every second hour based on data from Reddit
        </span>
      </div>
    </footer>
  );
}