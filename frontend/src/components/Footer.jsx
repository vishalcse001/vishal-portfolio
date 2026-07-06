function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Vishal Yadav. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a
            href="https://github.com/vishalcse001"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition text-sm"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/vishal-yadav-b8a171335"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition text-sm"
          >
            LinkedIn
          </a>
          <a
            href="mailto:vishalyadav.95055@gmail.com"
            className="hover:text-white transition text-sm"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer