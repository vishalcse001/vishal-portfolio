import { useState } from 'react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const [status, setStatus] = useState('')

const handleSubmit = async (e) => {
  e.preventDefault()
  setStatus('sending')

  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (response.ok) {
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } else {
      setStatus('error')
      console.error(data.error)
    }
  } catch (error) {
    setStatus('error')
    console.error(error)
  }
}
  return (
    <section id="contact" className="py-20 px-6 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide mb-2">
  Contact
</h2>
<h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
  Let's Work Together
</h3>
<p className="text-gray-600 dark:text-gray-300 mb-10">
  Have a project in mind or just want to say hi? Fill out the form below.
</p>

        <form onSubmit={handleSubmit} className="text-left space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your message..."
            ></textarea>
          </div>

          <button
  type="submit"
  disabled={status === 'sending'}
  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
>
  {status === 'sending' ? 'Sending...' : 'Send Message'}
</button>
        </form>
        {status === 'success' && (
  <p className="text-green-600 text-center mt-4">
    Message sent successfully! I'll get back to you soon.
  </p>
)}
{status === 'error' && (
  <p className="text-red-600 text-center mt-4">
    Something went wrong. Please try again.
  </p>
)}
      </div>
    </section>
  )
}

export default Contact