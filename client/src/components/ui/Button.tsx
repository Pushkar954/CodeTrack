export const Button: React.FC<{ children: React.ReactNode; onClick?: () => void; type?: 'button' | 'submit' | 'reset'; disabled?: boolean }> = ({ children, onClick, type = 'button', disabled }) => {
  return (
    <button
      className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
