const BackIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

type BackButtonProp = {
  onBackClick: () => void;
};

export const BackButton = ({ onBackClick }: BackButtonProp) => {
  return (
    <div className="max-w-6xl mx-auto pt-4">
      <button
        onClick={onBackClick}
        className="p-1 -ml-2 text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 group"
      >
        <div className="transform group-hover:-translate-x-0.5 transition-transform">
          <BackIcon />
        </div>
        <span className="font-semibold text-sm">Назад</span>
      </button>
    </div>
  );
};
