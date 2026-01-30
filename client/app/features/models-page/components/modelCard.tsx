import Link from "next/link";
import React from "react";

interface ModelCardProps {
  id: string;
  name: string;
  desc: string;
  version: string;
  type?: string;
}

const ModelCard: React.FC<ModelCardProps> = ({ id, name, desc, version, type }) => {
  return (
    <div className="group shadow-lg border border-neutral-800 rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
      <div>
        <div className = "flex justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{name}</h2>
          {type && (
            <div className = "py-1 px-4 border rounded-full">
              <p className = "text-sm">{ type }</p>
            </div>
          )}
        </div>

        <p className="mt-2 text-gray-600 dark:text-gray-300">{desc}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">v{version}</span>
          <Link href = {`/models/${id}`} className = "flex items-center justify-center px-4 py-2 text-sm font-semibold hover:text-purple-600 transition-colors">
            Try
          </Link>
      </div>
    </div>
  )
}

export default ModelCard;