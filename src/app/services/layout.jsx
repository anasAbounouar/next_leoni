// services/layout.jsx
import React from 'react';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('@/components/Sidebar.jsx'), { ssr: false });

const ServicesLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100 overflow-x-auto min-h-dvh">
        {children}
      </div>
    </div>
  );
};

export default ServicesLayout;
