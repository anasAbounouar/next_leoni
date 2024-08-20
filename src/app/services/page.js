import React from "react";
import { Avatar } from "@nextui-org/react";
import Sidebar from "@/components/Sidebar";

export default function ServicesPage() {
  const services = [
    {
      title: 'Fabrication de Faisceaux de Câbles',
      description: 'Leoni est un leader mondial dans la fabrication de faisceaux de câbles pour l\'industrie automobile, garantissant une qualité supérieure et une performance optimale.',
      imageUrl: '/images/cable-manufacturing.jpg',
      link: '/services/cable-manufacturing',
    },
    {
      title: 'Solutions d\'Interconnexion',
      description: 'Nous fournissons des solutions d\'interconnexion personnalisées, adaptées aux besoins spécifiques de chaque client, dans divers secteurs industriels.',
      imageUrl: '/images/interconnection-solutions.webp',
      link: '/services/interconnection-solutions',
    },
    {
      title: 'Innovations Technologiques',
      description: 'Leoni investit continuellement dans la recherche et le développement pour offrir des technologies de pointe, améliorant ainsi la sécurité et l\'efficacité des véhicules modernes.',
      imageUrl: '/images/technology-innovation.jpg',
      link: '/services/technology-innovation',
    },
    {
      title: 'Engagement Environnemental',
      description: 'Nous nous engageons à respecter les normes environnementales les plus strictes, en adoptant des pratiques de fabrication durables et en réduisant notre empreinte carbone.',
      imageUrl: '/images/environmental-commitment.webp',
      link: '/services/environmental-commitment',
    },
    {
      title: 'Support et Service Client',
      description: 'Leoni offre un service client de premier ordre, avec une équipe dédiée pour assurer un support continu et répondre rapidement aux besoins des clients.',
      imageUrl: '/images/customer-support.webp',
      link: '/services/customer-support',
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Nos Services</h2>
        <p className="text-lg mb-12 text-center text-gray-600">
          Chez Leoni Maroc, nous nous engageons à offrir des solutions innovantes et de haute qualité à nos clients dans le secteur automobile et au-delà. Découvrez nos services et ce que nous pouvons faire pour vous.
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
