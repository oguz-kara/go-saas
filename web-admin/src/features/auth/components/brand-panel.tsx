import React from "react";

export const BrandPanel: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center bg-zinc-900 text-white p-8">
      <h1 className="text-4xl font-bold">Your Company</h1>
      <p className="mt-2 text-lg text-zinc-300">Welcome back to the platform</p>
    </div>
  );
};
