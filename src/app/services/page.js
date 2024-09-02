import React from "react";
import Sidebar from "@/components/Sidebar";

export default function ServicesPage() {
  const services = [
    {
      title: 'Service 1',
      description: 'Leoni offre des services exceptionnels pour répondre aux besoins spécifiques de ses clients.',
      imageUrl: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHRlY2hub2xvZ3l8ZW58MHx8fHwxNjA3NTg1NTYx&ixlib=rb-1.2.1&q=80&w=400', // Image liée à la technologie
      link: '/services/service1',
    },
    {
      title: 'Service 2',
      description: 'Leoni propose des solutions innovantes pour améliorer l’efficacité et la qualité.',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGlubm92YXRpb258ZW58MHx8fHwxNjA3NTg1NTYx&ixlib=rb-1.2.1&q=80&w=400', // Image liée à l'innovation
      link: '/services/service2',
    },
    {
      title: 'Service 3',
      description: 'Découvrez les services de Leoni pour une gestion optimisée de vos projets.',
      imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG1hbmFnZW1lbnR8ZW58MHx8fHwxNjA3NTg1NjI4&ixlib=rb-1.2.1&q=80&w=400', // Image liée à la gestion
      link: '/services/service3',
    },
    {
      title: 'Service 4',
      description: 'Leoni s’engage à fournir des services de haute qualité adaptés à vos besoins.',
      imageUrl: "https://images.pexels.com/photos/845451/pexels-photo-845451.jpeg", // Image liée à la qualité
      link: '/services/service4',
    },
    {
      title: 'Service 5',
      description: 'Profitez des services de Leoni pour maximiser la performance de vos opérations.',
      imageUrl: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHBlcmZvcm1hbmNlfGVufDB8fHx8MTYwNzU4NTYzNA&ixlib=rb-1.2.1&q=80&w=400', // Image liée à la performance
      link: '/services/service5',
    },
    {
      title: 'Service 6',
      description: 'Leoni garantit un service client de premier ordre pour tous ses partenaires.',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGN1c3RvbWVyJTIwc2VydmljZXxlbnwwfHx8fDE2MDc1ODU2MzQ&ixlib=rb-1.2.1&q=80&w=400', // Image liée au service client
      link: '/services/service6',
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Nos Services</h2>
        <p className="text-lg mb-12 text-center text-gray-600">
          Découvrez les services proposés par Leoni pour répondre à tous vos besoins.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center p-6 bg-blue-50">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800">{service.title}</h3>
                <p className="mt-4 text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
