import React from "react";
import Sidebar from "@/components/Sidebar";

export default function ServicesPage() {
  const features = [
    {
      title: 'Planification et Programmation des Audits',
      description: "Cette fonctionnalité permet aux utilisateurs de planifier et de programmer facilement des audits en fonction des besoins de l'organisation. Grâce à un calendrier intégré, les équipes peuvent gérer les priorités et optimiser la répartition des ressources.",
      imageUrl: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHRlY2hub2xvZ3l8ZW58MHx8fHwxNjA3NTg1NTYx&ixlib=rb-1.2.1&q=80&w=400', // Replace with an appropriate image URL
      link: '/features/planification-audit',
    },
    {
      title: 'Exécution en Temps Réel et Collecte de Données',
      description: "Les auditeurs peuvent effectuer des audits sur le terrain ou à distance, tout en collectant des données en temps réel via l'application. Cette capacité assure une documentation précise et instantanée des constatations d'audit.",
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGlubm92YXRpb258ZW58MHx8fHwxNjA3NTg1NTYx&ixlib=rb-1.2.1&q=80&w=400', // Replace with an appropriate image URL
      link: '/features/execution-temps-reel',
    },
    {
      title: 'Suivi Automatisé des Audits et Gestion des Actions',
      description: "L'application automatise le suivi des audits, permettant de gérer les actions correctives et de s'assurer que les problèmes identifiés sont résolus en temps voulu. Les utilisateurs peuvent facilement suivre l'état des actions et rester informés grâce aux notifications.",
      imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG1hbmFnZW1lbnR8ZW58MHx8fHwxNjA3NTg1NjI4&ixlib=rb-1.2.1&q=80&w=400', // Replace with an appropriate image URL
      link: '/features/suivi-automatique',
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Fonctionnalités Principales</h2>
        <p className="text-lg mb-12 text-center text-gray-600">
          Voici les principales fonctionnalités de notre application de gestion des audits internes pour optimiser vos processus d'audit.
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
