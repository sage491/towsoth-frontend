import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useApp } from "../contexts/AppContext";

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-20 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onClose: () => void;
}

function Toast({ type, title, message, onClose }: ToastProps) {
  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-white border-emerald-200",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          titleColor: "text-emerald-900",
          messageColor: "text-emerald-700",
        };
      case "error":
        return {
          bg: "bg-white border-red-200",
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          titleColor: "text-red-900",
          messageColor: "text-red-700",
        };
      case "warning":
        return {
          bg: "bg-white border-amber-200",
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          titleColor: "text-amber-900",
          messageColor: "text-amber-700",
        };
      case "info":
        return {
          bg: "bg-white border-blue-200",
          icon: <Info className="w-5 h-5 text-blue-600" />,
          titleColor: "text-blue-900",
          messageColor: "text-blue-700",
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`${styles.bg} border rounded shadow-lg p-4 min-w-[320px] max-w-md pointer-events-auto animate-[slideInRight_0.3s_ease-out]`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{styles.icon}</div>
        <div className="flex-1 min-w-0">
          <div className={`text-[13px] font-semibold mb-0.5 ${styles.titleColor}`}>
            {title}
          </div>
          <div className={`text-[12px] ${styles.messageColor}`}>
            {message}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#6b7280] hover:text-[#1f2937] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
