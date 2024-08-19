import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>À propos - Application de Gestion des Audits Internes</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="bg-gray-100 min-h-screen">
        {/* Header Section */}
        <header className="bg-gray-800 text-white text-center py-6 border-b-4 border-green-500">
          <h1 className="text-3xl font-bold">Application de Gestion des Audits Internes</h1>
        </header>

        {/* Main Content Section */}
        <main id="main" className="container mx-auto px-4 py-8">
          <section id="about" className="mb-8">
            <h2 className="text-2xl font-semibold border-b-2 border-gray-800 pb-2 mb-4">
              À propos de cette application
            </h2>
            <p className="leading-relaxed mb-4">
              Cette application web, conçue pour la gestion efficace des audits internes, fournit une plateforme complète pour la planification, l'exécution et le suivi des activités d audit. Avec une interface conviviale, cette application garantit que les équipes d audit peuvent naviguer facilement à travers diverses fonctionnalités et maintenir la conformité aux normes de l'industrie.
            </p>
            <p className="leading-relaxed mb-4">
              Notre application de gestion des audits internes prend en charge diverses étapes du processus d audit, y compris :
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Planification et programmation des audits</li>
              <li>Exécution des audits en temps réel et collecte de données</li>
              <li>Suivi automatisé des audits et gestion des actions</li>
              <li>Rapports et analyses complets</li>
            </ul>
            <p className="leading-relaxed mb-4">
              L'application est construite avec des technologies web modernes pour offrir une expérience fluide sur tous les appareils. Que vous soyez au bureau ou en déplacement, l'application de gestion des audits vous assure de disposer des outils nécessaires pour gérer vos audits efficacement.
            </p>
            <p className="leading-relaxed mb-4">
              Fonctionnalités clés :
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Modèles d audit personnalisables</li>
              <li>Contrôle d accès basé sur les rôles</li>
              <li>Intégration avec les systèmes existants</li>
              <li>Stockage et accès sécurisés aux données</li>
            </ul>
            <p className="leading-relaxed mb-4">
              Notre objectif est d aider les organisations à maintenir des normes élevées de qualité et de conformité grâce à une gestion efficace et efficiente des audits. En utilisant notre application, vous pouvez réduire le temps et les coûts associés aux audits, améliorer la précision et la qualité des audits, augmenter la transparence et la responsabilité, et mieux gérer les risques et les conformités.
            </p>
            <p className="leading-relaxed">
              Notre équipe dédiée travaille sans relâche pour répondre aux besoins évolutifs du secteur, faisant de nous un partenaire de confiance dans l'industrie. Nous priorisons la durabilité, la qualité et l'amélioration continue dans tous nos processus.
            </p>
          </section>
        </main>

       
      </div>
    </>
  );
}
