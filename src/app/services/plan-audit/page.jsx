'use client';
import  { useState } from 'react';

export default function PlanAuditForm() {
  // State initialization for form data
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

  // Handles input changes for the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handles month selection for the month-specific input field
  const handleMonthSelection = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Handles changes in the text field for the selected month
  const handleMonthTextChange = (e) => {
    setMonthData((prevData) => ({
      ...prevData,
      [selectedMonth]: e.target.value,
    }));
  };
  // Submits the form data to the server
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
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="form-container p-10 bg-gradient-to-r bg-blue-50 to-pink-50 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-700 text-center border-b-4 border-blue-200 pb-3">Plan Audit</h2>
      <form onSubmit={handleSubmit}>
        {/* Scope Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-green-900">Scope</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="site_bu_department">Site / BU / Department:</label>
          <input type="text" id="site_bu_department" name="site_bu_department" value={formData.site_bu_department} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="processes">Processes:</label>
          <select id="processes" name="processes" value={formData.processes} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5">
            <option value="">Select Process</option>
            <option value="P2JO (P5,P6,7)">P2JO (P5,P6,7)</option>
            <option value="JCB VDA 6.3 (P5,P6,7)">JCB VDA 6.3 (P5,P6,7)</option>
            <option value="deroulante">deroulante</option>
          </select>

          <label className="block mb-3 font-medium text-gray-700" htmlFor="auditor">Auditor:</label>
          <input type="text" id="auditor" name="auditor" value={formData.auditor} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="co_auditor">Co-Auditor:</label>
          <input type="text" id="co_auditor" name="co_auditor" value={formData.co_auditor} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />
        </section>

        {/* Audit Team Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-green-900">Audit Team</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="lead_auditor">Lead Auditor:</label>
          <input type="text" id="lead_auditor" name="lead_auditor" value={formData.lead_auditor} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="co_auditor_team">Co-Auditor:</label>
          <input type="text" id="co_auditor_team" name="co_auditor_team" value={formData.co_auditor_team} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />
        </section>

        {/* Standard Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-green-900">Standard</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="iatf">IATF 16949:</label>
          <input type="text" id="iatf" name="iatf" value={formData.iatf} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="vda">VDA 6.3:</label>
          <input type="text" id="vda" name="vda" value={formData.vda} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="csr">CSR:</label>
          <input type="text" id="csr" name="csr" value={formData.csr} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />
        </section>

        {/* Inputs Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-green-900">Inputs</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="no_days">Number of Days:</label>
          <input type="number" id="no_days" name="no_days" value={formData.no_days} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="remark">Remarks:</label>
          <textarea id="remark" name="remark" value={formData.remark} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5"></textarea>

          <label className="block mb-3 font-medium text-gray-700" htmlFor="risks">Risks:</label>
          <textarea id="risks" name="risks" value={formData.risks} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5"></textarea>
        </section>

        {/* Scope of Audit Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-green-900">Scope of Audit</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="objective">Objective:</label>
          <input type="text" id="objective" name="objective" value={formData.objective} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="audit_criteria">Audit Criteria:</label>
          <input type="text" id="audit_criteria" name="audit_criteria" value={formData.audit_criteria} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />
        </section>

        {/* Months Specific Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-green-900">Month Specific</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="months">Select Month:</label>
          <select id="months" value={selectedMonth} onChange={handleMonthSelection} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5">
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>

          <label className="block mb-3 font-medium text-gray-700" htmlFor="month_text">Enter Text for Selected Month:</label>
          <input type="text" id="month_text" value={monthData[selectedMonth] || ''} onChange={handleMonthTextChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />
        </section>

        {/* Output Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-green-900">Output</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="onsite">Onsite:</label>
          <input type="text" id="onsite" name="onsite" value={formData.onsite} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="remote">Remote:</label>
          <input type="text" id="remote" name="remote" value={formData.remote} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="human_interaction">Human Interaction:</label>
          <input type="text" id="human_interaction" name="human_interaction" value={formData.human_interaction} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="audit_id">Audit ID:</label>
          <input type="text" id="audit_id" name="audit_id" value={formData.audit_id} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="result">Result:</label>
          <input type="text" id="result" name="result" value={formData.result} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />
        </section>

        {/* Additional Remarks Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-green-900">Additional Remarks</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="further_remarks">Further Remarks:</label>
          <textarea id="further_remarks" name="further_remarks" value={formData.further_remarks} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5"></textarea>
        </section>

        {/* History Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-green-900">History</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="issued_by">Issued By:</label>
          <input type="text" id="issued_by" name="issued_by" value={formData.issued_by} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="history_index">History Index:</label>
          <input type="text" id="history_index" name="history_index" value={formData.history_index} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />

          <label className="block mb-3 font-medium text-gray-700" htmlFor="revision_changes_reasons">Revision Changes / Reasons:</label>
          <textarea id="revision_changes_reasons" name="revision_changes_reasons" value={formData.revision_changes_reasons} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5"></textarea>

          <label className="block mb-3 font-medium text-gray-700" htmlFor="distribution">Distribution:</label>
          <input type="text" id="distribution" name="distribution" value={formData.distribution} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />
        </section>

        {/* Release Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-green-900">Release</h3>
          <label className="block mb-3 font-medium text-gray-700" htmlFor="released_by">Released By:</label>
          <input type="text" id="released_by" name="released_by" value={formData.released_by} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:blue-50 mb-5" />
        </section>

        <div className="flex justify-center">
          <button type="submit" className="bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-purple-600 transition-all duration-300">Submit</button>
        </div>
      </form>
    </div>
  );
}
