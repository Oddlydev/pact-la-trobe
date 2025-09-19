export default function Footer() {
  return (
    <footer className="text-center py-4 text-gray-600 text-sm">
      Powered by{" "}
      <a href="https://wpengine.com" target="_blank" rel="noopener noreferrer">
        WP Engine
      </a>
      <span>
        &copy; {new Date().getFullYear()}
      </span>
    </footer>
  );
}
