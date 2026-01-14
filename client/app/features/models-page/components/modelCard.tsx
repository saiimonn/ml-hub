import React from "react";

interface ModelCardProps {
  name: string;
  desc: string;
  version: string;
  type: string;
  onTry?: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ name, desc, version, type, onTry }) => {
  return (
    <div className="shadow-lg border border-neutral-800 rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
      <div>
        <div className = "flex justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{name}</h2>
          <div className = "py-1 px-4 border rounded-full">
            <p className = "text-sm">{ type }</p>
          </div>
        </div>

        <p className="mt-2 text-gray-600 dark:text-gray-300">{desc}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">v{version}</span>
        {onTry && (
          <button
            onClick={onTry}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try
          </button>
        )}
      </div>
    </div>
  )
}

export default ModelCard;