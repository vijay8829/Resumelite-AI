import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { ResumeData } from "../types";

export const pdfService = {
  exportToPDF(resume: ResumeData) {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(resume.personalInfo.fullName || "Your Name", margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const contactInfo = [
      resume.personalInfo.email,
      resume.personalInfo.phone,
      resume.personalInfo.location,
      resume.personalInfo.linkedin
    ].filter(Boolean).join(" | ");
    doc.text(contactInfo, margin, y);
    y += 15;

    // Summary
    if (resume.personalInfo.summary) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("PROFESSIONAL SUMMARY", margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const splitSummary = doc.splitTextToSize(resume.personalInfo.summary, 170);
      doc.text(splitSummary, margin, y);
      y += (splitSummary.length * 5) + 10;
    }

    // Experience
    if (resume.experience.length > 0) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("EXPERIENCE", margin, y);
      y += 8;

      resume.experience.forEach(exp => {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${exp.role} at ${exp.company}`, margin, y);
        y += 5;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        exp.achievements.forEach(ach => {
          const splitAch = doc.splitTextToSize(`• ${ach}`, 165);
          doc.text(splitAch, margin + 5, y);
          y += (splitAch.length * 5);
        });
        y += 5;

        // Check if we need a new page
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    }

    // Skills
    if (resume.skills.length > 0) {
        y += 5;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("SKILLS", margin, y);
        y += 6;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const skillsText = resume.skills.join(", ");
        doc.text(skillsText, margin, y);
    }

    doc.save(`${resume.title || "Resume"}.pdf`);
  }
};
