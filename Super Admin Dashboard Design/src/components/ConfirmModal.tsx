import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-600" />,
          iconBg: "bg-red-100",
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-12 h-12 text-amber-600" />,
          iconBg: "bg-amber-100",
          confirmButton: "bg-amber-600 hover:bg-amber-700 text-white",
        };
      case "info":
        return {
          icon: <AlertTriangle className="w-12 h-12 text-[#1e40af]" />,
          iconBg: "bg-blue-100",
          confirmButton: "bg-[#1e40af] hover:bg-[#1e3a8a] text-white",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]" onClick={onClose}>
      <div 
        className="bg-white rounded border border-[#d8dce2] w-full max-w-md m-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e8eaed] flex items-center justify-between">
          <h2 className="text-[#1f2937]">{title}</h2>
          <button 
            onClick={onClose}
            className="text-[#6b7280] hover:text-[#1f2937] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {styles.icon}
          </div>
          <p className="text-[14px] text-[#1f2937] leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-[#e8eaed] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white border border-[#d8dce2] rounded text-[13px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2 rounded text-[13px] transition-colors font-medium ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
