import React from "react";
import {
  Send,
  Upload,
  Trash2,
  Printer,
  AlertTriangle
} from "lucide-react";

const iconMap = {
  send: { icon: Send, color: "blue", bg: "from-blue-100 to-blue-200", text: "text-blue-600" },
  upload: { icon: Upload, color: "yellow", bg: "from-yellow-100 to-yellow-200", text: "text-yellow-600" },
  delete: { icon: Trash2, color: "red", bg: "from-red-100 to-red-200", text: "text-red-600" },
  print: { icon: Printer, color: "blue", bg: "from-blue-100 to-blue-200", text: "text-blue-600" },
  default: { icon: AlertTriangle, color: "gray", bg: "from-gray-100 to-gray-200", text: "text-gray-600" },
};

const getIconConfig = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("send")) return iconMap.send;
  if (t.includes("upload")) return iconMap.upload;
  if (t.includes("delete") || t.includes("remove")) return iconMap.delete;
  if (t.includes("print")) return iconMap.print;
  return iconMap.default;
};

const ConfirmDialog = ({ open, title = "", message, onCancel, onConfirm }) => {
  if (!open) return null;

  const { icon: Icon, bg, text } = getIconConfig(title);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md space-y-6 animate-in zoom-in-95 duration-300 ease-out">

        {/* Icon */}
        <div className="flex justify-center">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center`}>
            <Icon className={`w-8 h-8 ${text}`} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white 
              ${text === 'text-red-600'
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25'
                : text === 'text-yellow-600'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-yellow-400/25'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25'
              } 
              shadow-lg transition-all duration-200 hover:scale-105 active:scale-95`}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
