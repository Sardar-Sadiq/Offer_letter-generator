document
  .getElementById("offerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const joiningDate = document.getElementById("joiningDate").value;
    const completionDate = document.getElementById("completionDate").value;
    const domain = document.getElementById("domain").value;

    generateOfferLetter(name, joiningDate, completionDate, domain);
  });
async function generateOfferLetter(name, joiningDate, completionDate, domain) {
  const pdfDoc = await PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  const fontSize = 12;
  const lineHeight = fontSize * 1.5;
  const margin = 50;
  const contentWidth = width - 2 * margin;

  const offerLetterContent = `
    Offer Letter

    Dear ${name},

    We are pleased to offer you the position of mern developer at [Company Name]. 
    You are scheduled to start on ${joiningDate} and your anticipated completion date is ${completionDate}.
    Your domain will be ${domain}.

    [Company Name] is excited to have you join our team and contribute to our success. 
    Please review the attached offer letter for further details.

    Sincerely,
    [HR name]
    [HR Position]
    [Company Name]
`;

  const lines = offerLetterContent.split("\n");

  // Calculate starting y position for content
  let y = height - margin - fontSize;

  // Draw offer letter content
  lines.forEach((line) => {
    // Check if content exceeds available height
    if (y - lineHeight < margin) {
      // Add new page
      page.addPage([600, 800]); // Adjust page size as needed
      y = height - margin - fontSize;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontSize}px Helvetica`;
    const lineWidth = ctx.measureText(line).width;

    const x = margin;

    page.drawText(line.trim(), {
      x: x,
      y: y,
      size: fontSize,
    });

    y -= lineHeight;
  });

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${name.replace(/\s+/g, "_").toLowerCase()}_Offerletter.pdf`;
  link.click();
}
