'use client';

import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire up to mailing list / API
    setSubmitted(true);
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col footer-col--nav">
          <a href="/about">About</a>
          <a href="https://careers.curious.vc/" target="_blank" rel="noopener noreferrer">Careers</a>
          <a href="/companies">Companies</a>
          <a href="/approach">Approach</a>
          <a href="/news">News</a>
        </div>
        <div className="footer-col footer-col--social">
          <a href="#">Linkedin</a>
          <a href="#">Twitter</a>
          <a href="#">Medium</a>
          <a href="#">Email</a>
        </div>
        <div className="footer-col footer-col--newsletter">
          <p>
            Curious is a long-term holding company that buys and grows software companies with
            empathy.
          </p>
          <p>
            Join the Curious Dispatch to receive our latest thinking, news, and opportunities
            within our portfolio.
          </p>
          {submitted ? (
            <p className="newsletter-success">Thanks — you&apos;re on the list.</p>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                className="newsletter-input"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-dark btn-sm">Get in Touch</button>
            </form>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <p>©️ Curious Holdings 2026</p>
      </div>
    </footer>
  );
}
