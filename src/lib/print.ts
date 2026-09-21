import type { Document, ExamResult, FeeInstallment, Holiday, Student } from '@/types';
import type { MainExamResult } from './admin-mock-data';
import { formatCurrency, formatDate } from './utils';

const SCHOOL_NAME = 'SchoolAI International Academy';

const PRINT_STYLES = `
  * { box-sizing: border-box; }
  body { font-family: -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color: #111827; margin: 0; padding: 40px; }
  .sheet { max-width: 720px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 12px; padding: 32px; }
  .brand { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2563EB; padding-bottom: 16px; margin-bottom: 24px; }
  .brand h1 { font-size: 20px; margin: 0; color: #1E40AF; }
  .brand span { font-size: 12px; color: #6B7280; }
  h2 { font-size: 18px; margin: 0 0 16px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #E5E7EB; }
  th { background: #F9FAFB; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #6B7280; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; font-size: 13px; }
  .grid dt { color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
  .grid dd { margin: 2px 0 0; font-weight: 600; }
  .total { font-size: 16px; font-weight: 700; text-align: right; margin-top: 12px; }
  .stamp { display: inline-block; border: 2px solid #059669; color: #059669; padding: 4px 14px; border-radius: 6px; font-weight: 700; letter-spacing: .1em; transform: rotate(-4deg); }
  .foot { margin-top: 28px; font-size: 11px; color: #9CA3AF; text-align: center; }
  @media print { body { padding: 0; } .sheet { border: none; } }
`;

export function escapeHtml(value: string | number | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Opens a print dialog (Save as PDF). Returns false when the pop-up is blocked. */
export function openPrintable(title: string, bodyHtml: string): boolean {
  const win = window.open('', '_blank', 'width=860,height=960');
  if (!win) return false;
  win.document.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${PRINT_STYLES}</style></head><body>${bodyHtml}</body></html>`,
  );
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
  return true;
}

function brandHeader(subtitle: string): string {
  return `<div class="brand"><h1>${escapeHtml(SCHOOL_NAME)}</h1><span>${escapeHtml(subtitle)}</span></div>`;
}

export function buildReceiptHtml(student: Student, installment: FeeInstallment): string {
  const total = installment.paidAmount + installment.lateFee;
  return `<div class="sheet">
    ${brandHeader('Fee Receipt')}
    <h2>Payment Receipt <span class="stamp">PAID</span></h2>
    <dl class="grid">
      <div><dt>Receipt No.</dt><dd>${escapeHtml(installment.transactionId)}</dd></div>
      <div><dt>Payment Date</dt><dd>${installment.paidDate ? escapeHtml(formatDate(installment.paidDate)) : '-'}</dd></div>
      <div><dt>Student</dt><dd>${escapeHtml(student.name)}</dd></div>
      <div><dt>Class / Roll No.</dt><dd>${escapeHtml(student.class)}-${escapeHtml(student.section)} / ${escapeHtml(student.rollNumber)}</dd></div>
      <div><dt>Installment</dt><dd>${escapeHtml(installment.label)}</dd></div>
      <div><dt>Payment Mode</dt><dd>${escapeHtml((installment.paymentMode || '-').toUpperCase())}</dd></div>
    </dl>
    <table>
      <thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
      <tbody>
        <tr><td>${escapeHtml(installment.label)} fee</td><td style="text-align:right">${escapeHtml(formatCurrency(installment.paidAmount))}</td></tr>
        <tr><td>Late fee</td><td style="text-align:right">${escapeHtml(formatCurrency(installment.lateFee))}</td></tr>
      </tbody>
    </table>
    <div class="total">Total Paid: ${escapeHtml(formatCurrency(total))}</div>
    <div class="foot">This is a computer-generated receipt and does not require a signature.</div>
  </div>`;
}

export function buildReportCardHtml(student: Student, result: ExamResult): string {
  const rows = result.subjects
    .map(
      (s) => `<tr>
        <td>${escapeHtml(s.subject)}</td>
        <td>${escapeHtml(s.theory)}</td>
        <td>${s.practical !== undefined ? escapeHtml(s.practical) : '-'}</td>
        <td>${s.internal !== undefined ? escapeHtml(s.internal) : '-'}</td>
        <td><strong>${escapeHtml(s.total)}/${escapeHtml(s.maxMarks)}</strong></td>
        <td>${escapeHtml(s.percentage)}%</td>
        <td>${escapeHtml(s.grade)}</td>
      </tr>`,
    )
    .join('');
  return `<div class="sheet">
    ${brandHeader('Report Card')}
    <h2>${escapeHtml(result.examName)}</h2>
    <dl class="grid">
      <div><dt>Student</dt><dd>${escapeHtml(student.name)}</dd></div>
      <div><dt>Class / Roll No.</dt><dd>${escapeHtml(result.class)}-${escapeHtml(result.section)} / ${escapeHtml(student.rollNumber)}</dd></div>
      <div><dt>Overall</dt><dd>${escapeHtml(result.totalPercentage)}% (Grade ${escapeHtml(result.overallGrade)})</dd></div>
      <div><dt>Class Rank</dt><dd>${result.rank !== undefined ? '#' + escapeHtml(result.rank) : '-'}</dd></div>
    </dl>
    <table>
      <thead><tr><th>Subject</th><th>Theory</th><th>Practical</th><th>Internal</th><th>Total</th><th>%</th><th>Grade</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${result.remarks ? `<p style="font-size:13px"><strong>Class teacher's remarks:</strong> ${escapeHtml(result.remarks)}</p>` : ''}
    <div class="foot">Generated from SchoolAI. This copy is valid without a signature.</div>
  </div>`;
}

export function buildDocumentHtml(doc: Document, student: Student): string {
  return `<div class="sheet">
    ${brandHeader('Document Vault')}
    <h2>${escapeHtml(doc.name)}</h2>
    <dl class="grid">
      <div><dt>Student</dt><dd>${escapeHtml(student.name)}</dd></div>
      <div><dt>Class</dt><dd>${escapeHtml(student.class)}-${escapeHtml(student.section)}</dd></div>
      <div><dt>Uploaded On</dt><dd>${escapeHtml(formatDate(doc.uploadDate))}</dd></div>
      <div><dt>Reference</dt><dd>${escapeHtml(doc.id)}</dd></div>
    </dl>
    <div class="foot">Preview copy generated by SchoolAI. The original file is stored securely in the school records.</div>
  </div>`;
}

export function buildAttachmentHtml(fileName: string, context: { title: string; subject: string; teacher: string; dueDate: string }): string {
  return `<div class="sheet">
    ${brandHeader('Homework Attachment')}
    <h2>${escapeHtml(fileName)}</h2>
    <dl class="grid">
      <div><dt>Homework</dt><dd>${escapeHtml(context.title)}</dd></div>
      <div><dt>Subject</dt><dd>${escapeHtml(context.subject)}</dd></div>
      <div><dt>Assigned By</dt><dd>${escapeHtml(context.teacher)}</dd></div>
      <div><dt>Due Date</dt><dd>${escapeHtml(formatDate(context.dueDate))}</dd></div>
    </dl>
    <div class="foot">Preview copy generated by SchoolAI. The original attachment is stored with the homework record.</div>
  </div>`;
}

/** Opens a real file URL when one exists, otherwise falls back to a printable copy. */
export function downloadOrPrint(url: string, title: string, fallbackHtml: string): boolean {
  if (url && url !== '#') {
    window.open(url, '_blank', 'noopener');
    return true;
  }
  return openPrintable(title, fallbackHtml);
}

export function buildNoticeAttachmentHtml(fileName: string, notice: { title: string; postedDate: string }): string {
  return `<div class="sheet">
    ${brandHeader('Notice Attachment')}
    <h2>${escapeHtml(fileName)}</h2>
    <dl class="grid">
      <div><dt>Notice</dt><dd>${escapeHtml(notice.title)}</dd></div>
      <div><dt>Posted On</dt><dd>${escapeHtml(formatDate(notice.postedDate))}</dd></div>
    </dl>
    <div class="foot">Preview copy generated by SchoolAI. The original attachment is stored with the notice.</div>
  </div>`;
}

export function buildMarksheetHtml(
  schoolName: string,
  student: { name: string; class: string; section: string; rollNumber: string },
  result: MainExamResult,
): string {
  const subjectRows = result.subjects
    .map(
      (s) =>
        `<tr>
          <td>${escapeHtml(s.subject)}</td>
          <td style="text-align:center">${escapeHtml(s.maxMarks)}</td>
          <td style="text-align:center">${escapeHtml(s.marksObtained)}</td>
          <td style="text-align:center">${escapeHtml(s.grade)}</td>
          <td style="text-align:center"><span style="color:${s.isPassed ? '#2e7d32' : '#c62828'};font-weight:700">${s.isPassed ? 'PASS' : 'FAIL'}</span></td>
        </tr>`,
    )
    .join('');

  const resultStamp = result.isPassed
    ? '<span class="stamp" style="border-color:#059669;color:#059669">PASSED</span>'
    : '<span class="stamp" style="border-color:#c62828;color:#c62828">FAILED</span>';

  return `<div class="sheet">
    <div class="brand" style="flex-direction:column;align-items:center;text-align:center">
      <h1 style="font-size:22px">${escapeHtml(schoolName)}</h1>
      <span style="margin-top:4px">Affiliated to CBSE, New Delhi</span>
    </div>
    <h2 style="text-align:center;margin-bottom:4px">MARKSHEET</h2>
    <p style="text-align:center;font-size:12px;color:#6B7280;margin:0 0 16px">Half Yearly Examination 2026-27</p>
    <dl class="grid">
      <div><dt>Student Name</dt><dd>${escapeHtml(student.name)}</dd></div>
      <div><dt>Class / Section</dt><dd>${escapeHtml(student.class)}-${escapeHtml(student.section)}</dd></div>
      <div><dt>Roll Number</dt><dd>${escapeHtml(student.rollNumber)}</dd></div>
      <div><dt>Rank in Class</dt><dd>#${escapeHtml(result.rank)}</dd></div>
    </dl>
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th style="text-align:center">Max Marks</th>
          <th style="text-align:center">Marks Obtained</th>
          <th style="text-align:center">Grade</th>
          <th style="text-align:center">Result</th>
        </tr>
      </thead>
      <tbody>
        ${subjectRows}
        <tr style="font-weight:700;background:#F9FAFB">
          <td>TOTAL</td>
          <td style="text-align:center">${escapeHtml(result.totalMarks)}</td>
          <td style="text-align:center">${escapeHtml(result.totalObtained)}</td>
          <td style="text-align:center">${escapeHtml(result.grade)}</td>
          <td style="text-align:center">${resultStamp}</td>
        </tr>
      </tbody>
    </table>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
      <div style="font-size:14px"><strong>Percentage:</strong> ${escapeHtml(result.percentage)}%</div>
      <div style="font-size:14px"><strong>Overall Grade:</strong> ${escapeHtml(result.grade)}</div>
    </div>
    ${result.remarks ? `<p style="font-size:13px;margin-top:12px"><strong>Remarks:</strong> ${escapeHtml(result.remarks)}</p>` : ''}
    <div style="display:flex;justify-content:space-between;margin-top:48px;font-size:12px;color:#374151">
      <div style="text-align:center">
        <div style="border-top:1px solid #9CA3AF;padding-top:6px;width:140px">Class Teacher</div>
      </div>
      <div style="text-align:center">
        <div style="border-top:1px solid #9CA3AF;padding-top:6px;width:140px">Principal</div>
      </div>
    </div>
    <div class="foot" style="margin-top:24px">This is a computer-generated marksheet and does not require a physical signature.</div>
  </div>`;
}

export function buildStudentMarksheetHtml(student: Student, result: ExamResult): string {
  const rows = result.subjects
    .map(
      (s) => `<tr>
        <td>${escapeHtml(s.subject)}</td>
        <td style="text-align:center">${escapeHtml(s.maxMarks)}</td>
        <td style="text-align:center">${escapeHtml(s.theory)}</td>
        <td style="text-align:center">${s.practical !== undefined ? escapeHtml(s.practical) : '-'}</td>
        <td style="text-align:center">${s.internal !== undefined ? escapeHtml(s.internal) : '-'}</td>
        <td style="text-align:center"><strong>${escapeHtml(s.total)}</strong></td>
        <td style="text-align:center"><strong>${escapeHtml(s.grade)}</strong></td>
      </tr>`,
    )
    .join('');
  const obtained = result.subjects.reduce((sum, s) => sum + s.total, 0);
  const maximum = result.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
  const passed = result.subjects.every((s) => s.percentage >= 33);
  return `<div class="sheet" style="border:3px double #1E40AF">
    ${brandHeader('Statement of Marks')}
    <h2 style="text-align:center">${escapeHtml(result.examName)}</h2>
    <dl class="grid">
      <div><dt>Student Name</dt><dd>${escapeHtml(student.name)}</dd></div>
      <div><dt>Class / Section</dt><dd>${escapeHtml(result.class)}-${escapeHtml(result.section)}</dd></div>
      <div><dt>Roll Number</dt><dd>${escapeHtml(student.rollNumber)}</dd></div>
      <div><dt>Date of Birth</dt><dd>${escapeHtml(formatDate(student.dateOfBirth))}</dd></div>
    </dl>
    <table>
      <thead><tr><th>Subject</th><th style="text-align:center">Max</th><th style="text-align:center">Theory</th><th style="text-align:center">Practical</th><th style="text-align:center">Internal</th><th style="text-align:center">Obtained</th><th style="text-align:center">Grade</th></tr></thead>
      <tbody>${rows}
        <tr><td><strong>Grand Total</strong></td><td style="text-align:center"><strong>${maximum}</strong></td><td colspan="3"></td><td style="text-align:center"><strong>${obtained}</strong></td><td style="text-align:center"><strong>${escapeHtml(result.overallGrade)}</strong></td></tr>
      </tbody>
    </table>
    <dl class="grid">
      <div><dt>Percentage</dt><dd>${escapeHtml(result.totalPercentage)}%</dd></div>
      <div><dt>Class Rank</dt><dd>${result.rank !== undefined ? '#' + escapeHtml(result.rank) + (result.classSize ? ' of ' + escapeHtml(result.classSize) : '') : '-'}</dd></div>
      <div><dt>Result</dt><dd><span class="stamp" style="${passed ? '' : 'border-color:#DC2626;color:#DC2626'}">${passed ? 'PASS' : 'FAIL'}</span></dd></div>
      <div><dt>Grading Scale</dt><dd style="font-size:11px">A+ 90-100 | A 75-89 | B+ 65-74 | B 55-64 | C 33-54</dd></div>
    </dl>
    ${result.remarks ? `<p style="font-size:13px"><strong>Remarks:</strong> ${escapeHtml(result.remarks)}</p>` : ''}
    <div style="display:flex;justify-content:space-between;margin-top:48px;font-size:12px;color:#374151"><span>Class Teacher</span><span>Parent / Guardian</span><span>Principal</span></div>
    <div class="foot">Generated from SchoolAI. This copy is valid without a signature.</div>
  </div>`;
}

export function buildHolidayListHtml(holidays: Holiday[]): string {
  const fmt = (h: Holiday) => (h.endDate ? `${formatDate(h.date)} - ${formatDate(h.endDate)}` : formatDate(h.date));
  const rows = holidays
    .map((h) => `<tr><td>${escapeHtml(fmt(h))}</td><td>${escapeHtml(h.name)}</td><td>${escapeHtml(h.type)}</td></tr>`)
    .join('');
  return `<div class="sheet">
    ${brandHeader('Holiday Calendar 2026-27')}
    <h2>Academic Year 2026-27 Holidays</h2>
    <table><thead><tr><th>Date</th><th>Holiday</th><th>Type</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="foot">Festival dates may change with the lunar calendar. The school will notify any change.</div>
  </div>`;
}
