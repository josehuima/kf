import { useState } from "react";
import { CheckCircle } from "lucide-react";

const SuccessMessage = ({ message }: { message: string }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 bg-orange-100 text-orange-700 p-6 rounded-xl shadow-lg flex items-center space-x-3 w-[350px] text-lg">
      <CheckCircle size={32} className="text-orange-600" />
      <span className="flex-grow">{message}</span>
      <button
        onClick={() => setVisible(false)}
        className="text-orange-800 text-sm font-semibold hover:underline"
      >
        Fechar
      </button>
    </div>
  );
};

export default SuccessMessage;
