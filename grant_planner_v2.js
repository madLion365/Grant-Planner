import React, { useState } from "react";

// Define NIH training grant steps with tips and detailed info
const nihSteps = [
  {
    title: "Draft Specific Aims Page",
    tip:
      "Keep your aims page to one page, use bullet points for each aim, and start each aim with an action verb.",
    details: (
      <ul className="list-disc list-inside space-y-2">
        <li>Keep the document to one page and concise.</li>
        <li>Use clear action verbs for each aim (e.g., "Investigate", "Determine").</li>
        <li>Limit to 2–4 aims to maintain focus and feasibility.</li>
        <li>Frame aims around a central hypothesis with alternative outcomes.</li>
        <li>Avoid purely descriptive aims; ensure each aim tests a clear question.</li>
        <li>Check that aims can be completed within the grant timeframe (4–5 years).</li>
        <li>Iteratively refine with feedback from colleagues and mentors.</li>
      </ul>
    ),
  },
  {
    title: "Develop Research Strategy",
    tip:
      "Structure it into Significance, Innovation, and Approach. Use sub‑headings and signpost clearly.",
    details: (
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Significance:</strong> Explain the problem, knowledge gap, and impact on the field.</li>
        <li><strong>Innovation:</strong> Highlight novelty or paradigm-shifting aspects of your project.</li>
        <li>
          <strong>Approach:</strong> Outline key experiments, preliminary data, methods,
          and feasibility checks.
        </li>
        <li>Use clear sub-headings and logical flow to guide the reader.</li>
        <li>Align each section with your Specific Aims and central hypothesis.</li>
      </ul>
    ),
  },
  {
    title: "Gather Letters of Support",
    tip:
      "Reach out early—give letter writers a summary and your CV 4–6 weeks before the deadline.",
    details: (
      <ul className="list-disc list-inside space-y-2">
        <li>Identify mentors, collaborators, and institutional contacts.</li>
        <li>Provide a brief summary, your CV, and draft aims to each writer.</li>
        <li>Set clear deadlines and send polite reminders one week before due date.</li>
        <li>Confirm submission process (e.g., eRA Commons link) with letter writers.</li>
      </ul>
    ),
  },
  {
    title: "Finalize Proposal and Budget",
    tip:
      "Double‑check NIH budget caps and make sure your justification is concise and clear.",
    details: (
      <ul className="list-disc list-inside space-y-2">
        <li>Review FOA budget limits and institutional guidelines.</li>
        <li>Justify each cost item with a brief, clear rationale.</li>
        <li>Ensure alignment between budget, Specific Aims, and research strategy.</li>
        <li>Proofread all sections and confirm formatting per NIH requirements.</li>
      </ul>
    ),
  },
];

// Mapping for future extension
const mechanismSteps = {
  NIH: nihSteps,
};

function generateCalendarLink(title, date) {
  const formattedDate = date.replace(/-/g, "").replace(/T.*/, "");
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);
  const formattedEnd = endDate.toISOString().split("T")[0].replace(/-/g, "");

  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${formattedDate}/${formattedEnd}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
      title
    )}&startdt=${date}`,
    ical: `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${encodeURIComponent(
      title
    )}%0ADTSTART;VALUE=DATE:${formattedDate}%0ADTEND;VALUE=DATE:${formattedEnd}%0AEND:VEVENT%0AEND:VCALENDAR`,
  };
}

function Modal({ step, onClose }) {
  if (!step) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-[#DCD7C9] p-6 rounded-xl shadow-lg max-w-lg w-full overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold mb-4 text-[#2C3930]">{step.title}</h2>
        <div className="prose mb-4 text-[#2C3930]">{step.details}</div>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-[#3F4F44] hover:bg-[#2C3930] text-[#DCD7C9] rounded-lg shadow"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function GrantCalculator() {
  const [mechanism, setMechanism] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [activeStep, setActiveStep] = useState(null);

  const generateSchedule = () => {
    if (!mechanism) {
      alert("Please select a funding mechanism.");
      return;
    }
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    const steps = mechanismSteps[mechanism] || [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    const interval = Math.floor(totalDays / steps.length);

    const newSched = steps.map((step, i) => {
      const deadline = new Date(start);
      deadline.setDate(start.getDate() + interval * (i + 1));
      return {
        ...step,
        deadline: deadline.toISOString().split("T")[0],
      };
    });

    setSchedule(newSched);
  };

  // Sidebar outline items
  const outlineItems = mechanism ? mechanismSteps[mechanism] : [];

  return (
    <div className="min-h-screen bg-[#DCD7C9] font-sans">
      {/* Header with navigation tabs and coalition branding */}
      <header className="bg-[#3F4F44] shadow-md mb-6">
        <nav className="max-w-5xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            {/* Custom flask icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-[#A27B5C]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 2v4H5l7 12h0l7-12h-4V2H9z"
              />
            </svg>
            <span className="text-xl font-bold text-[#A27B5C]">ResearchQuest Consortium</span>
          </div>
          <div className="space-x-6">
            {['Home','Resources','About','Contact'].map(tab => (
              <a
                key={tab}
                href="#"
                className="text-[#2C3930] hover:text-[#A27B5C] font-medium"
              >
                {tab}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto flex">
        {/* Sidebar outline panel */}
        <aside className="w-1/4 bg-[#3F4F44] text-[#DCD7C9] p-4 rounded-xl sticky top-20 h-fit">
          <h2 className="text-lg font-semibold mb-4">Outline</h2>
          <ul className="space-y-2">
            {outlineItems.map((item, idx) => (
              <li
                key={idx}
                className="cursor-pointer hover:text-[#A27B5C]"
                onClick={() => setActiveStep(item)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-6">
          <h1 className="text-3xl font-extrabold mb-4 text-[#3F4F44]">Grant Planner</h1>

          {/* Mechanism dropdown and date selectors */}
          <div className="mb-6 flex flex-wrap items-center space-x-4">
            <label className="font-medium text-[#2C3930]">Mechanism:</label>
            <select
              value={mechanism}
              onChange={(e) => setMechanism(e.target.value)}
              className="border border-[#DCD7C9] p-2 rounded"
            >
              <option value="">Select Mechanism</option>
              <option value="NIH">NIH Training Grant</option>
            </select>

            <label className="font-medium text-[#2C3930]">Start:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-[#DCD7C9] p-2 rounded"
            />

            <label className="font-medium text-[#2C3930]">End:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-[#DCD7C9] p-2 rounded"
            />
          </div>

          <button
            onClick={generateSchedule}
            className="px-4 py-2 bg-[#A27B5C] text-[#DCD7C9] rounded shadow mb-6"
          >
            Generate Schedule
          </button>

          {schedule.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedule.map((item, idx) => {
                const links = generateCalendarLink(item.title, item.deadline);
                return (
                  <div
                    key={idx}
                    className="bg-[#3F4F44] text-[#DCD7C9] p-4 rounded-lg shadow cursor-pointer"
                    onClick={() => setActiveStep(item)}
                  >
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm">Deadline: {item.deadline}</p>
                    <div className="mt-2 space-x-2 text-xs">
                      <a href={links.google} target="_blank" rel="noopener noreferrer">
                        Add to Google
                      </a>
                      <a href={links.outlook} target="_blank" rel="noopener noreferrer">
                        Add to Outlook
                      </a>
                      <a href={links.ical} download={`${item.title}.ics`}>
                        iCal
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Modal step={activeStep} onClose={() => setActiveStep(null)} />
        </main>
      </div>
    </div>
  );
}
