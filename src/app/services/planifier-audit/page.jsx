'use client';
import React, { useState } from 'react';

export default function PlanAuditForm() {
  // Initialize state for form data
  const [formData, setFormData] = useState({
    site_bu_department: '',
    processes: '',
    auditor: '',
    co_auditor: '',
    lead_auditor: '',
    co_auditor_team: '',
    iatf: '',
    vda: '',
    csr: '',
    no_days: '',
    remark: '',
    risks: '',
    objective: '',
    audit_criteria: '',
    onsite: '',
    remote: '',
    human_interaction: '',
    audit_id: '',
    result: '',
    further_remarks: '',
    issued_by: '',
    history_index: '',
    revision_changes_reasons: '',
    distribution: '',
    released_by: '',
  });

  const [monthData, setMonthData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMonthSelection = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleMonthTextChange = (e) => {
    setMonthData({
      ...monthData,
      [selectedMonth]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const combinedData = { ...formData, months: monthData };
    console.log("Submitting form data:", combinedData);
    try {
      const response = await fetch('http://127.0.0.1:5000/plan_audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData),
      });
      if (response.ok) {
        alert('Form submitted successfully!');
      } else {
        alert('Failed to submit the form.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('There was an error submitting the form.');
    }
  };

  return (
    <div className="form-container p-10 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-purple-700 text-center border-b-4 border-purple-200 pb-3">Plan Audit</h2>
      <form onSubmit={handleSubmit}>
        {/* Scope Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-pink-600">Scope</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="site_bu_department">Site / BU / Department:</label>
          <input type="text" id="site_bu_department" name="site_bu_department" value={formData.site_bu_department} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="processes">Processes:</label>
          <select id="processes" name="processes" value={formData.processes} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5">
            <option value="">Select Process</option>
            <option value="P2JO (P5,P6,7)">P2JO (P5,P6,7)</option>
            <option value="JCB VDA 6.3 (P5,P6,7)">JCB VDA 6.3 (P5,P6,7)</option>
            <option value="deroulante">deroulante</option>
            {/* Add other options here */}
          </select>

          <label className="block mb-3 font-medium text-gray-700" htmlFor="auditor">Auditor:</label>
          <input type="text" id="auditor" name="auditor" value={formData.auditor} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="co_auditor">Co Auditor:</label>
          <input type="text" id="co_auditor" name="co_auditor" value={formData.co_auditor} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />
        </section>

        {/* Audit Team Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-pink-600">Audit Team</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="lead_auditor">Lead Auditor:</label>
          <input type="text" id="lead_auditor" name="lead_auditor" value={formData.lead_auditor} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="co_auditor_team">Co-Auditor:</label>
          <input type="text" id="co_auditor_team" name="co_auditor_team" value={formData.co_auditor_team} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />
        </section>

        {/* Standard Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-pink-600">Standard</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="iatf">IATF 16949:</label>
          <input type="text" id="iatf" name="iatf" value={formData.iatf} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="vda">VDA 6.3:</label>
          <input type="text" id="vda" name="vda" value={formData.vda} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="csr">CSR:</label>
          <input type="text" id="csr" name="csr" value={formData.csr} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />
        </section>

        {/* Inputs Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-pink-600">Inputs</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="no_days">No days:</label>
          <input type="number" id="no_days" name="no_days" value={formData.no_days} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="remark">Remark:</label>
          <textarea id="remark" name="remark" value={formData.remark} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5"></textarea>

          <label className="block mb-3 font-medium text-gray-700" htmlFor="risks">Risks:</label>
          <textarea id="risks" name="risks" value={formData.risks} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5"></textarea>

          <label className="block mb-3 font-medium text-gray-700" htmlFor="objective">Objective:</label>
          <textarea id="objective" name="objective" value={formData.objective} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5"></textarea>

          <label className="block mb-3 font-medium text-gray-700" htmlFor="audit_criteria">Audit Criteria:</label>
          <textarea id="audit_criteria" name="audit_criteria" value={formData.audit_criteria} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5"></textarea>
        </section>

        {/* Method Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-pink-600">Method</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="onsite">Onsite:</label>
          <input type="text" id="onsite" name="onsite" value={formData.onsite} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="remote">Remote:</label>
          <input type="text" id="remote" name="remote" value={formData.remote} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="human_interaction">Human Interaction:</label>
          <input type="text" id="human_interaction" name="human_interaction" value={formData.human_interaction} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />
        </section>

        {/* Months Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-pink-600">Months</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="months">Select Month:</label>
          <select id="months" value={selectedMonth} onChange={handleMonthSelection} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5">
            <option value="">Select a month</option>
            <option value="feb">February</option>
            <option value="march">March</option>
            <option value="apr">April</option>
            <option value="may">May</option>
            <option value="june">June</option>
            <option value="july">July</option>
            <option value="aug">August</option>
            <option value="sept">September</option>
            <option value="oct">October</option>
            <option value="nov">November</option>
            <option value="dec">December</option>
            <option value="jan">January</option>
          </select>

          {selectedMonth && (
            <div className="mb-4">
              <label className="block mb-3 font-medium text-gray-700" htmlFor="monthText">Text for {selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}:</label>
              <input
                type="text"
                id="monthText"
                value={monthData[selectedMonth] || ''}
                onChange={handleMonthTextChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder={`Enter text for ${selectedMonth}`}
              />
            </div>
          )}
        </section>

        {/* Additional Information Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-pink-600">Additional Information</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="audit_id">Audit ID:</label>
          <input type="text" id="audit_id" name="audit_id" value={formData.audit_id} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="result">Result:</label>
          <input type="text" id="result" name="result" value={formData.result} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="further_remarks">Further Remarks:</label>
          <textarea id="further_remarks" name="further_remarks" value={formData.further_remarks} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5"></textarea>

          <label className="block mb-3 font-medium text-gray-700" htmlFor="issued_by">Issued by (Name / Date / Function):</label>
          <input type="text" id="issued_by" name="issued_by" value={formData.issued_by} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="history_index">History Index:</label>
          <input type="date" id="history_index" name="history_index" value={formData.history_index} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="revision_changes_reasons">Revision Changes / Reasons:</label>
          <input type="text" id="revision_changes_reasons" name="revision_changes_reasons" value={formData.revision_changes_reasons} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="distribution">Distribution:</label>
          <input type="text" id="distribution" name="distribution" value={formData.distribution} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="released_by">Released by (Name / Date / Function):</label>
          <input type="text" id="released_by" name="released_by" value={formData.released_by} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 mb-5" />
        </section>

        <input type="submit" value="Submit" className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white p-4 rounded-lg cursor-pointer hover:bg-gradient-to-l hover:from-purple-400 hover:to-pink-400 transition-colors duration-300" />
      </form>
    </div>
  );
}
