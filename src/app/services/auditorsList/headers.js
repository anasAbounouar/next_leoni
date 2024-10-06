// headers.js
const headers = [
    {
        column: 0,
        level1: null,
        level2: null,
        level3: null,
        level4: 'Actions' // Actions column as the first column
    },
    {
        column: 1,
        level1: null,
        level2: null,
        level3: null,
        level4: 'No.'
    },
    {
        column: 2,
        level1: null,
        level2: null,
        level3: null,
        level4: 'Family Name'
    },
    {
        column: 3,
        level1: null,
        level2: null,
        level3: null,
        level4: 'First Name'
    },
    {
        column: 4,
        level1: null,
        level2: null,
        level3: null,
        level4: 'Actual job title / position / function'
    },
    {
        column: 5,
        level1: null,
        level2: null,
        level3: null,
        level4: 'Home Plant (LOKID)'
    },
    {
        column: 6,
        level1: 'Qualified Auditor',
        level2: 'System',
        level3: null,
        level4: 'Qualified System Lead Auditor'
    },
    {
        column: 7,
        level1: 'Qualified Auditor',
        level2: 'System',
        level3: null,
        level4: 'Qualified System Co-Auditor'
    },
    {
        column: 8,
        level1: 'Qualified Auditor',
        level2: 'System',
        level3: null,
        level4: 'Approved for following customers'
    },
    {
        column: 9,
        level1: 'Qualified Auditor',
        level2: 'Process',
        level3: null,
        level4: 'Qualified Process Lead Auditor'
    },
    {
        column: 10,
        level1: 'Qualified Auditor',
        level2: 'Process',
        level3: null,
        level4:'Qualified Process Co-Auditor'
    },
    {
        column: 11,
        level1: 'Qualified Auditor',
        level2: 'Process',
        level3: null,
        level4: 'Approved for following customers'
    },
    {
        column: 12,
        level1: null,
        level2: 'General',
        level3: null,
        level4: 'Good knowledge of the LEONI-Instructions and QM-standards [ref. ISO 19011:2018_7.2.3.2]'
    },
    {
        column: 13,
        level1: null,
        level2: 'General',
        level3: null,
        level4: 'Has knowledge / experience in moderation, communication, leadership and planning, conduct, report, and close out findings [ref. IATF 16949:2016_7.2.3 e), ISO 19011:2018]'
    },
    {
        column: 14,
        level1: null,
        level2: 'General',
        level3: null,
        level4: 'Has understanding of the automotive process aproach for auditing, including risk-based thinking [ref. IATF 16949:2016_7.2.3 a)]'
    },
    {
        column: 15,
        level1: null,
        level2: 'General',
        level3: null,
        level4: 'Knowledge required from CSRs [ref. IATF 16949:2016_7.2.3 b)]'
    },
    {
        column: 16,
        level1: null,
        level2: 'General',
        level3: "Automotive quality core tools '[ref. IATF 16949:2016_7.2.3 d), core tools acc. AIAG.org]'",
        level4: 'SPC Knowledge'
    },
    {
        column: 17,
        level1: null,
        level2: 'General',
        level3: "Automotive quality core tools '[ref. IATF 16949:2016_7.2.3 d), core tools acc. AIAG.org]'",
        level4: 'MSA Knowledge'
    },
    {
        column: 18,
        level1: null,
        level2: 'General',
        level3: "Automotive quality core tools '[ref. IATF 16949:2016_7.2.3 d), core tools acc. AIAG.org]'",
        level4: 'APQP Knowledge'
    },
    {
        column: 19,
        level1: null,
        level2: 'General',
        level3: "Automotive quality core tools '[ref. IATF 16949:2016_7.2.3 d), core tools acc. AIAG.org]'",
        level4: 'PPAP Knowledge'
    },
    {
        column: 20,
        level1: null,
        level2: 'General',
        level3: "Automotive quality core tools '[ref. IATF 16949:2016_7.2.3 d), core tools acc. AIAG.org]'" ,
        level4: 'FMEA Knowledge'
    },
    {
        column: 21,
        level1: null,
        level2: 'SYSTEM AUDIT',
        level3: null,
        level4: 'Is trained to ISO 9001 and IATF 16949/ Audit realisation [ref. IATF 16949:2016_7.2.3 c)]'
    },
    {
        column: 22,
        level1: null,
        level2: 'SYSTEM AUDIT',
        level3: null,
        level4: 'Has participated 2 times on a System Audit (as Co-Auditor)'
    },
    {
        column: 23,
        level1: null,
        level2: 'SYSTEM AUDIT',
        level3: null,
        level4: 'Has sufficient work experience, function linked to QM (>2 years)'
    },
    {
        column: 24,
        level1: null,
        level2: 'SYSTEM AUDIT',
        level3: 'Has knowledge and skills  in following[ref. ISO 19011:2018:2018_7.2.3]',
        level4: 'Quality terminology'
    },
    {
        column: 25,
        level1: null,
        level2: 'SYSTEM AUDIT',
        level3: 'Has knowledge and skills  in following[ref. ISO 19011:2018:2018_7.2.3]',
        level4: 'QM principles and their application, which include Evidence and Risk based approach that consider risks and opportunities'
    },
    {
        column: 26,
        level1: null,
        level2: 'SYSTEM AUDIT',
        level3: 'Has knowledge and skills  in following[ref. ISO 19011:2018:2018_7.2.3]',
        level4: 'Applicable statutory and regulatory requirementes and other requirements'
    },
    {
        column: 27,
        level1: null,
        level2: 'SYSTEM AUDIT',
        level3: 'Additional competence to be Lead auditor',
        level4: 'Competence to develop Annual audit programme, audit strategy and assign audit tasks acc. to specific competence of individual audit team members [ref. IATF 16949:2016_7.2.3 e)]'
    },
    {
        column: 28,
        level1: null,
        level2: 'SYSTEM AUDIT',
        level3: 'Additional competence to be Lead auditor',
        level4: 'Competence to issue audit announcement, audit report, and hand it over to the respective Audit Coordinator and to the Head/QM of audited unit [ref. IATF 16949:2016_7.2.3 e)]'
    },
    {
        column: 29,
        level1: null,
        level2: 'SYSTEM AUDIT',
        level3: 'Additional competence to be Lead auditor',
        level4: 'Competence to discuss strategic issues with top management of the auditee to determine whether they have considered these issues when evaluating their risks and opportunities [ref. ISO 19011:2018:2018_7.2.3.4 b)]'
    },
    {
        column: 30,
        level1: null,
        level2: 'SYSTEM AUDIT',
        level3: 'Additional competence to be Lead auditor',
        level4: 'Competence to develop and maintain a collaborative working relationship among the audit team members [ref. ISO 19011:2018:2018_7.2.3.4 c)]'
    },
    {
        column: 31,
        level1: null,
        level2: 'SYSTEM AUDIT',
        level3: 'Additional competence to be Lead auditor',
        level4: 'Competence to establish suitable mechanisms for the continual evaluation of the perfomrance of the auditors and audit team leaders [ref. ISO 19011:2018:2018_7.2.6]'
    },
    {
        column: 32,
        level1: null,
        level2: 'SYSTEM AUDIT',
        level3: 'Requalification',
        level4: 'Has performed at least 1 system audit or participated in at least 3 system audit days per year in total. Auditors in remote locations must participate in at least 1 audit day per year in total.'
    },
    {
        column: 33,
        level1: null,
        level2: 'PROCESS AUDIT',
        level3: null,
        level4: 'Technical competence in the area to be audited, including process risk analyses (PFMEA) and control plans [ref. IATF 16949:2016_7.2.3]'
    },
    {
        column: 34,
        level1: null,
        level2: 'PROCESS AUDIT',
        level3: null,
        level4: 'Successful participation in a VDA 6.3 training course or according to Customer specific  training requirement for Process Auditors [ref. ISO 19011:2018:2018_7.2.3.1]'
    },
    {
        column: 35,
        level1: null,
        level2: 'PROCESS AUDIT',
        level3: 'Additional requirements and competence to be Lead auditor',
        level4: 'Has participated in at least 1 Process Audit (as Co-Auditor)'
    },
    {
        column: 36,
        level1: null,
        level2: 'PROCESS AUDIT',
        level3: 'Additional requirements and competence to be Lead auditor',
        level4: '3 years industrial experience, including at least 1 year in QM/Process Management'
    },
    {
        column: 37,
        level1: null,
        level2: 'PROCESS AUDIT',
        level3: 'Additional requirements and competence to be Lead auditor',
        level4: 'Competence to issue audit announcement, audit report, and hand it over to the respective Audit Coordinator and to the Head/QM of audited unit [ref. ISO 19011:2018:2018_7.2.3.4 a), b)]'
    },
    {
        column: 38,
        level1: null,
        level2: 'PROCESS AUDIT',
        level3: 'Additional requirements and competence to be Lead auditor',
        level4: 'Competence to develop and maintain a collaborative working relationship among the audit team members [ref. ISO 19011:2018:2018_7.2.3.4 c)]'
    },
    {
        column: 39,
        level1: null,
        level2: 'PROCESS AUDIT',
        level3: 'Requalification',
        level4: 'Has performed at least 1 audit per year'
    },
    {
        column: 40,
        level1: null,
        level2: null,
        level3: 'PRODUCT AUDIT',
        level4: 'Has competence in use of relevant measuring and test equipment to verify product conformity [ref. IATF 16949:2016_7.2.3]'
    },
    {
        column: 41,
        level1: null,
        level2: null,
        level3: 'PRODUCT AUDIT',
        level4: 'Has knowledge (competence) of the customer specification (product requirements) [ref. IATF 16949:2016_7.2.3]'
    },
    {
        column: 42,
        level1: null,
        level2: null,
        level3: 'PRODUCT AUDIT',
        level4: 'Has performed on at least 3 Product Audits per year'
    },
    
];
export default headers;