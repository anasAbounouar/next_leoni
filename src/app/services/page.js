import React from "react";
import Sidebar from "@/components/Sidebar";

export default function ServicesPage() {
  const features = [
    {
      title: 'Audit Planning and Scheduling',
      description: "This feature allows users to easily plan and schedule audits based on the organization's needs. With an integrated calendar, teams can manage priorities and optimize resource allocation.",
      imageUrl: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHRlY2hub2xvZ3l8ZW58MHx8fHwxNjA3NTg1NTYx&ixlib=rb-1.2.1&q=80&w=400', // Replace with an appropriate image URL
      link: '/features/audit-planning',
    },
    {
      title: 'Real-Time Execution and Data Collection',
      description: "Auditors can conduct audits in the field or remotely while collecting real-time data through the application. This capability ensures accurate and instant documentation of audit findings.",
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGlubm92YXRpb258ZW58MHx8fHwxNjA3NTg1NTYx&ixlib=rb-1.2.1&q=80&w=400', // Replace with an appropriate image URL
      link: '/features/real-time-execution',
    },
    {
      title: 'Automated Audit Follow-up and Action Management',
      description: "The application automates audit follow-up, allowing for the management of corrective actions and ensuring that identified issues are resolved in a timely manner. Users can easily track the status of actions and stay informed through notifications.",
      imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG1hbmFnZW1lbnR8ZW58MHx8fHwxNjA3NTg1NjI4&ixlib=rb-1.2.1&q=80&w=400', // Replace with an appropriate image URL
      link: '/features/automated-follow-up',
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        main functionalities</h2>
        <p className="text-lg mb-12 text-center text-gray-600">
          Here are the main features of our internal audit management application to optimize your audit processes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center p-6 bg-blue-50">
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800">{feature.title}</h3>
                <p className="mt-4 text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
