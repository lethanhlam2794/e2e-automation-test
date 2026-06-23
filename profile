const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  LevelFormat, BorderStyle, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ImageRun, VerticalAlign, ShadingType
} = require('docx');
const fs = require('fs');
const path = require('path');

const NAVY = "1F2D3D";
const TEAL = "2E7D7B";
const GRAY = "5A5A5A";
const LIGHTGRAY = "888888";

// Page: US Letter, 1 inch margins -> content width 9360 DXA
const PAGE_WIDTH = 9360;
const LEFT_COL = 5760;   // ~62%
const RIGHT_COL = 3600;  // ~38%

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const outputDir = path.join(__dirname, "cv");
const photoPath = path.join(outputDir, "photo_0.png");
const outputPath = path.join(outputDir, "Le_Thanh_Lam_CV_EN.docx");
const photoChildren = fs.existsSync(photoPath)
  ? [
    new ImageRun({
      type: "png",
      data: fs.readFileSync(photoPath),
      transformation: { width: 95, height: 110 },
      altText: { title: "Photo", description: "Profile photo", name: "Photo" }
    })
  ]
  : [];

function sectionHeading(text, color) {
  return new Paragraph({
    spacing: { before: 160, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: color || NAVY, space: 3 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 20, font: "Arial", color: color || NAVY })]
  });
}

function bullet(text, size) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 30 },
    children: [new TextRun({ text, size: size || 19 })]
  });
}

function expEntry(title, org, dates, bullets) {
  const out = [
    new Paragraph({
      spacing: { before: 100, after: 6 },
      children: [new TextRun({ text: title, bold: true, size: 20 })]
    }),
    new Paragraph({
      spacing: { after: 50 },
      children: [
        new TextRun({ text: org, italics: true, size: 19, color: GRAY }),
        dates ? new TextRun({ text: "   |   " + dates, size: 18, color: LIGHTGRAY }) : new TextRun("")
      ]
    })
  ];
  bullets.forEach(b => out.push(bullet(b)));
  return out;
}

function infoLine(label, value) {
  return new Paragraph({
    spacing: { after: 50 },
    children: [
      new TextRun({ text: label + ": ", bold: true, size: 18 }),
      new TextRun({ text: value, size: 18, color: GRAY })
    ]
  });
}

function skillBullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 35 },
    children: [new TextRun({ text, size: 18 })]
  });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 19, color: "333333" } }
    }
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 220, hanging: 180 } } }
        }]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 720, right: 1440, bottom: 720, left: 1440 }
      }
    },
    children: [

      // ===================== SECTION 1: HEADER (photo + name + goal) =====================
      new Table({
        width: { size: PAGE_WIDTH, type: WidthType.DXA },
        columnWidths: [1800, 7560],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 1800, type: WidthType.DXA },
                borders: noBorders,
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: photoChildren
                  })
                ]
              }),
              new TableCell({
                width: { size: 7560, type: WidthType.DXA },
                borders: noBorders,
                verticalAlign: VerticalAlign.CENTER,
                margins: { left: 200 },
                children: [
                  new Paragraph({
                    spacing: { after: 20 },
                    children: [new TextRun({ text: "LE THANH LAM", bold: true, size: 36, font: "Arial", color: NAVY })]
                  }),
                  new Paragraph({
                    spacing: { after: 100 },
                    children: [new TextRun({ text: "Backend Developer", size: 22, color: TEAL })]
                  }),
                  new Paragraph({
                    children: [new TextRun({
                      text: "Backend developer with 2 years of experience in TypeScript and NestJS, looking to move into a System Operator role. Comfortable with troubleshooting, deployment, and production support, with a longer-term goal of growing into a DevOps Engineer.",
                      size: 18, color: GRAY
                    })]
                  })
                ]
              })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { before: 160 }, children: [] }),

      // ===================== SECTION 2: TWO COLUMNS =====================
      new Table({
        width: { size: PAGE_WIDTH, type: WidthType.DXA },
        columnWidths: [LEFT_COL, RIGHT_COL],
        rows: [
          new TableRow({
            children: [
              // ---------- LEFT COLUMN ----------
              new TableCell({
                width: { size: LEFT_COL, type: WidthType.DXA },
                borders: noBorders,
                margins: { right: 220 },
                children: [
                  sectionHeading("Education", NAVY),
                  new Paragraph({
                    spacing: { after: 6 },
                    children: [new TextRun({ text: "Ho Chi Minh City Institute of Applied Science & Technology (HIAST)", bold: true, size: 19 })]
                  }),
                  new Paragraph({
                    spacing: { after: 40 },
                    children: [new TextRun({ text: "Information Technology   |   2022 - 2025", size: 18, color: LIGHTGRAY })]
                  }),
                  bullet("Major: Software Development"),
                  bullet("GPA: 3.41 / 4.0"),
                  bullet("Graduation project: e-book reading website (PostgreSQL, React, Node.js)"),

                  sectionHeading("Experience", NAVY),
                  ...expEntry(
                    "Backend Developer",
                    "Green Software Technology Service Company Limited",
                    "Feb 2025 - Present",
                    [
                      "Maintain API integration services using Node.js and PostgreSQL",
                      "Contribute to the VNeID electronic identity authentication system"
                    ]
                  ),
                  ...expEntry(
                    "Backend Developer",
                    "VCPay App",
                    "",
                    [
                      "Work on payment processing and user management features using NestJS and PostgreSQL",
                      "Use ethers.js for wallet signature verification and national ID card checks"
                    ]
                  ),
                  ...expEntry(
                    "Backend / Fullstack Developer",
                    "Other projects: Vinachain.io, Backend Green Trader, AidaCity/BrickImmo",
                    "",
                    [
                      "Built user management and wallet APIs in NestJS and TypeScript",
                      "Used Redis for caching and session recovery, PostgreSQL for transactional data",
                      "Integrated blockchain libraries (ethers.js, Web3.js) for wallet and transaction tracking"
                    ]
                  ),
                ]
              }),

              // ---------- RIGHT COLUMN ----------
              new TableCell({
                width: { size: RIGHT_COL, type: WidthType.DXA },
                borders: noBorders,
                shading: { fill: "F4F6F7", type: ShadingType.CLEAR },
                margins: { left: 200, top: 100, right: 150, bottom: 100 },
                children: [
                  sectionHeading("Personal Info", TEAL),
                  infoLine("Phone", "+84 765 916 108"),
                  infoLine("Email", "lethanhlam2794@gmail.com"),
                  infoLine("Address", "Go Vap, HCMC"),
                  infoLine("Date of birth", "27/09/2004"),

                  sectionHeading("Skills", TEAL),
                  skillBullet("TypeScript, JavaScript (ES6+)"),
                  skillBullet("NestJS, Node.js, Express.js"),
                  skillBullet("PostgreSQL, MySQL, MongoDB, Redis"),
                  skillBullet("React, Next.js, Tailwind CSS"),
                  skillBullet("RESTful APIs, JWT authentication"),
                  skillBullet("Python (working knowledge)"),

                  sectionHeading("Reference", TEAL),
                  new Paragraph({
                    spacing: { after: 4 },
                    children: [new TextRun({ text: "Tran Quang Huy", bold: true, size: 18 })]
                  }),
                  new Paragraph({
                    spacing: { after: 4 },
                    children: [new TextRun({ text: "Senior Software Engineer", size: 17, color: GRAY })]
                  }),
                  new Paragraph({
                    spacing: { after: 4 },
                    children: [new TextRun({ text: "Green Software Technology Service Co., Ltd.", size: 17, color: GRAY })]
                  }),
                  new Paragraph({
                    spacing: { after: 4 },
                    children: [new TextRun({ text: "huy.tq2106@gmail.com", size: 17, color: GRAY })]
                  }),
                ]
              })
            ]
          })
        ]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  console.log(`done: ${outputPath}`);
});
