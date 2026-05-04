const FooterDisclaimer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6 px-4 mt-auto">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-500 text-xs">
          ⚠️ <strong className="text-gray-400">Demo Project</strong> — This
          application is a student project created for educational purposes
          only. It is not affiliated with, endorsed by, or connected to
          Coinbase, Inc. or any real cryptocurrency exchange.
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Do not enter real passwords, financial information, or personal data.
          All data shown is for demonstration purposes only.
        </p>
      </div>
    </footer>
  );
};

export default FooterDisclaimer;