import React from "react";

const FeedbackButton: React.FC = () => {
  return (
    <a
      href="https://forms.gle/4eYtVzMh2vSZFUtP6"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 flex items-center space-x-2"
    >
      {/* Optional icon (Heroicons) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954 8.955c.44.439 1.196.131 1.196-.494v-6.786a.75.75 0 01.75-.75h6.785c.626 0 .934-.755.494-1.196L11.25 2.25a.75.75 0 00-1.06 0L2.25 12z"
        />
      </svg>
      <span>Feedback</span>
    </a>
  );
};

export default FeedbackButton;
