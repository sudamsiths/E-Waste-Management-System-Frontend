import React, { useState } from 'react';
import Header from '../common/Header';

interface FormData {
  email: string;
  subject: string;
  message: string;
}

function Contact() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setFormData({ email: '', subject: '', message: '' });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <section className="bg-white dark:bg-green-700 min-h-screen " style={{paddingTop: '4rem'}}>
        {/* ...existing code... */}
        

        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <h2 className="text-4xl font-extrabold text-center text-green-900 dark:text-white mb-6">
            Contact Us
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg mb-10">
            Got a technical issue? Want to send feedback about our e-waste recycling services? Need details about our pickup services? Let us know.
          </p>

          {submitted && (
            <div className="mb-6 p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 animate-fade-in" role="alert">
              <span className="font-medium">Success!</span> Your message has been sent successfully. We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-3 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                placeholder="Let us know how we can help you"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Your message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full p-3 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                placeholder="Leave a comment..."
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-block px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {isSubmitting ? 'Sending...' : 'Send message'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default Contact;