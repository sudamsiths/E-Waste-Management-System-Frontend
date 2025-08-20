import { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Handle newsletter subscription
      console.log('Subscribing email:', email);
      setEmail('');
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-background"></div>
          <div className="newsletter-content">
            <h2 className="newsletter-title">
              Sign Up To Get Updates &amp;<br />
              News About Us..
            </h2>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <div className="email-input-container">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  className="email-input"
                  required
                  aria-label="Email address for newsletter subscription"
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                className="subscribe-button"
                aria-label="Subscribe to newsletter"
                disabled={!email.trim()}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Info Section */}
        <div className="footer-info">
          {/* Company Info */}
          <div className="company-section">
            <div className="company-brand">
              <h3 className="brand-name">
                Eco.
                <br />
                Tech
              </h3>
            </div>
            <p className="company-description">
              There are many variations of passages of Lorem
              <br />
              Ipsum available, but as a the majority have suffered
              <br />
              alteration in some form, by injected humour, or ratt
              <br />
              randomised words which don't look.
            </p>
            <div className="social-icons">
              <a
                href="#"
                className="social-icon facebook-icon"
                aria-label="Follow us on Facebook"
                role="button"
                tabIndex={0}
              >
                <span>f</span>
              </a>
              <a
                href="#"
                className="social-icon twitter-icon"
                aria-label="Follow us on Twitter"
                role="button"
                tabIndex={0}
              >
                <span>𝕏</span>
              </a>
              <a
                href="#"
                className="social-icon pinterest-icon"
                aria-label="Follow us on Pinterest"
                role="button"
                tabIndex={0}
              >
                <span>P</span>
              </a>
              <a
                href="#"
                className="social-icon instagram-icon"
                aria-label="Follow us on Instagram"
                role="button"
                tabIndex={0}
              >
                <div className="instagram-camera">
                  <div className="camera-lens"></div>
                  <div className="camera-dot"></div>
                </div>
              </a>
            </div>
          </div>

          {/* Latest News */}
          <div className="news-section">
            <h3 className="section-title">Latest News</h3>
            <div className="news-item">
              <div className="news-tag">NEWS</div>
              <div className="news-content">
                <h4 className="news-title">
                  There Are Many Variations
                  <br />
                  Passages
                </h4>
                <p className="news-date">📅 Jan 06, 2024</p>
              </div>
            </div>
            <div className="news-item">
              <div className="news-tag">NEWS</div>
              <div className="news-content">
                <h4 className="news-title">
                  There Are Many Variations
                  <br />
                  Passages
                </h4>
                <p className="news-date">📅 Jan 06, 2024</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="contact-section">
            <h3 className="section-title">Contact Info</h3>
            <div className="contact-info">
              <div className="contact-address">
                <a
                  href="https://maps.google.com/?q=2972+Westheimer+Rd+Santa+Ana+Illinois+85486"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View our location on Google Maps"
                  style={{ color: '#FFF', textDecoration: 'none' }}
                >
                  📍 2972 Westheimer Rd. Santa Ana,
                  <br />
                  <span className="address-line">Illinois 85486</span>
                </a>
              </div>
              <div className="contact-phone">
                <a
                  href="tel:+14065550120"
                  aria-label="Call us at (406) 555-0120"
                  style={{ color: '#FFF', textDecoration: 'none' }}
                >
                  📱 (406) 555-0120
                </a>
              </div>
              <div className="contact-email">
                <a
                  href="mailto:example@gmail.com"
                  aria-label="Send us an email"
                  style={{ color: '#FFF', textDecoration: 'none' }}
                >
                  ✉️ example@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Copyright */}
        <div className="copyright">
          Eco Tech © 2025 By Sudamsiths
        </div>
      </div>
    </footer>
  );
};

export default Footer;
