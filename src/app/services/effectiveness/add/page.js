'use client';
import { Alert } from '@mui/material';
import { Input, Textarea, Button, Select, SelectItem } from '@nextui-org/react';
import { useRef, useState } from 'react';
import Swal from'sweetalert2';
// Tailwind CSS custom color variables should be defined in tailwind.config.js
export default function AuditForm() {
 
    const formRef = useRef(null);
  const handleSubmit = (event) => {
      event.preventDefault(); 
      
    Swal.fire({
        title: 'Succès!',
      text: 'Le formulaire a été soumis avec succès.',
      icon: 'success',
      confirmButtonText: 'OK'
    })
      // Reset the form
      formRef.current.reset();
  };
    return (
        <>
             
    <form ref={formRef}  onSubmit={handleSubmit} className="space-y-8 p-6 bg-background text-text rounded-xl shadow-lg my-10 mx-6">
      {/* Scope Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Portée</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Site / BU / Département :" 
            placeholder="Entrez le site/BU/département" 
            id="site" 
            name="site" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
          <Input 
            label="Processus :" 
            placeholder="Entrez les processus" 
            id="processes" 
            name="processes" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
          />
          <Input 
            label="Auditeur :" 
            placeholder="Entrez le nom de l'auditeur" 
            id="auditor" 
            name="auditor" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
          />
          <Input 
            label="Co-Auditeur :" 
            placeholder="Entrez le nom du co-auditeur" 
            id="co_auditor" 
            name="co_auditor" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
          <Input 
            label="ID d'Audit :" 
            placeholder="Entrez l'ID de l'audit" 
            id="audit_id" 
            name="audit_id" 
            fullWidth 
            className="border-border focus:border-primary focus:ring-primary" 
            />
        </div>
      </section>

      {/* Audit Team Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Équipe d&apos;Audit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Auditeur Principal :" 
            placeholder="Entrez le nom de l'auditeur principal" 
            id="lead_auditor" 
            name="lead_auditor" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
          <Input 
            label="Co-Auditeur :" 
            placeholder="Entrez le nom du co-auditeur" 
            id="co_auditor_team" 
            name="co_auditor_team" 
            fullWidth 
            className="border-border focus:border-primary focus:ring-primary" 
            />
        </div>
      </section>

      {/* Standard Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Norme</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="IATF 16949 :" 
            placeholder="Entrez IATF 16949" 
            id="iatf" 
            name="iatf" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
          <Input 
            label="VDA 6.3 :" 
            placeholder="Entrez VDA 6.3" 
            id="vda" 
            name="vda" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
          <Input 
            label="CSR :" 
            placeholder="Entrez CSR" 
            id="csr" 
            name="csr" 
            fullWidth 
            className="border-border focus:border-primary focus:ring-primary" 
            />
        </div>
      </section>

      {/* Result Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Résultat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="NC1 :" 
            placeholder="Entrez NC1" 
            id="nc1" 
            name="nc1" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
          />
          <Input 
            label="NC2 :" 
            placeholder="Entrez NC2" 
            id="nc2" 
            name="nc2" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
          <Input 
            label="OFI :" 
            placeholder="Entrez OFI" 
            id="ofi" 
            name="ofi" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
          />
          <Input 
            label="VDA 6.3 (Résultat) :" 
            placeholder="Entrez le résultat VDA 6.3" 
            id="vda_result" 
            name="vda_result" 
            fullWidth 
            className="border-border focus:border-primary focus:ring-primary" 
            />
        </div>
      </section>

      {/* Inputs Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Entrées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Nombre de jours :" 
            placeholder="Entrez le nombre de jours" 
            id="no_days" 
            name="no_days" 
            type="number" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
          <Textarea 
            label="Remarque :" 
            placeholder="Entrez les remarques" 
            id="remark" 
            name="remark" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
          <Textarea 
            label="Risques :" 
            placeholder="Entrez les risques" 
            id="risks" 
            name="risks" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
          <Textarea 
            label="Objectif :" 
            placeholder="Entrez l'objectif" 
            id="objective" 
            name="objective" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
          />
          <Textarea 
            label="Critères d'Audit :" 
            placeholder="Entrez les critères d'audit" 
            id="audit_criteria" 
            name="audit_criteria" 
            fullWidth 
            className="border-border focus:border-primary focus:ring-primary" 
            />
        </div>
      </section>

      {/* Method Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Méthode</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Sur site :" 
            placeholder="Entrez la méthode sur site" 
            id="onsite" 
            name="onsite" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
          />
          <Input 
            label="À distance :" 
            placeholder="Entrez la méthode à distance" 
            id="remote" 
            name="remote" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
          <Input 
            label="Interaction humaine :" 
            placeholder="Entrez la méthode d'interaction humaine" 
            id="human_interaction" 
            name="human_interaction" 
            fullWidth 
            className="border-border focus:border-primary focus:ring-primary" 
            />
        </div>
      </section>

      {/* Internal WSD Audit follow-up and tracking sheet Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Suivi et feuille de suivi de l&apos;audit interne WSD</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Date du Rapport :" 
            id="date_of_report" 
            name="date_of_report" 
            type="date" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
          <Input 
            label="Statut :" 
            placeholder="Entrez le statut" 
            id="status" 
            name="status" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
          />
          <Input 
            label="Date de soumission PDCA :" 
            id="pdca_submission_date" 
            name="pdca_submission_date" 
            type="date" 
            fullWidth 
            className="border-border focus:border-primary focus:ring-primary" 
            />
        </div>
      </section>

      {/* Action Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Action</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Responsable :" 
            placeholder="Entrez le responsable" 
            id="responsible" 
            name="responsible" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
          <Input 
            label="Échéance :" 
            placeholder="Entrez l'échéance" 
            id="deadline" 
            name="deadline" 
            type="date" 
            fullWidth 
            className="mb-4 border-border focus:border-primary focus:ring-primary" 
            />
        </div>
      </section>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="bg-primary text-background hover:bg-primaryDark"
      >
        Soumettre
      </Button>
    </form>
        </>
  );
}