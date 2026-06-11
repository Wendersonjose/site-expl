import PDFDocument from 'pdfkit';

/**
 * Exportadores genéricos de relatório (CSV e PDF).
 * Portado do módulo de relatórios da branch develop (autoria: Túlio,
 * PR #31), adaptado ao padrão de código do projeto.
 */

// BOM UTF-8: garante acentuação correta ao abrir o CSV no Excel.
const UTF8_BOM = '﻿';

function stringifyCell(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

export function normalizeRows(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data === null || data === undefined) {
    return [];
  }

  return [data];
}

export function toCsv(data) {
  const rows = normalizeRows(data);

  if (!rows.length) {
    return UTF8_BOM;
  }

  const headers = [...new Set(rows.flatMap((row) => Object.keys(row ?? {})))];
  const lines = [headers.join(',')];

  for (const row of rows) {
    const values = headers.map((header) => {
      const cellValue = stringifyCell(row?.[header]);
      const escapedValue = cellValue.replace(/"/g, '""');

      return /[",\n\r]/.test(cellValue) ? `"${escapedValue}"` : escapedValue;
    });

    lines.push(values.join(','));
  }

  return `${UTF8_BOM}${lines.join('\n')}`;
}

function formatPdfValue(value) {
  if (value === null || value === undefined) {
    return '-';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

export async function toPdfBuffer({ title, subtitle, data, filters = {} }) {
  const rows = normalizeRows(data);

  return new Promise((resolve, reject) => {
    const document = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];

    document.on('data', (chunk) => chunks.push(chunk));
    document.on('end', () => resolve(Buffer.concat(chunks)));
    document.on('error', reject);

    document.fontSize(18).text(title, { align: 'center' });
    if (subtitle) {
      document.moveDown(0.5).fontSize(10).fillColor('#555555').text(subtitle, { align: 'center' });
    }

    if (Object.keys(filters).length > 0) {
      document.moveDown();
      document.fontSize(12).fillColor('#111111').text('Filtros aplicados');
      document.fontSize(10).fillColor('#333333').text(JSON.stringify(filters, null, 2));
    }

    document.moveDown();

    if (!rows.length) {
      document.fontSize(11).fillColor('#111111').text('Sem dados para exibir.');
      document.end();
      return;
    }

    rows.forEach((row, index) => {
      if (index > 0) {
        document.moveDown();
      }

      document.fontSize(12).fillColor('#111111').text(`Registro ${index + 1}`);

      if (row && typeof row === 'object' && !Array.isArray(row)) {
        Object.entries(row).forEach(([key, value]) => {
          document.fontSize(10).fillColor('#333333').text(`${key}: ${formatPdfValue(value)}`);
        });
      } else {
        document.fontSize(10).fillColor('#333333').text(formatPdfValue(row));
      }
    });

    document.end();
  });
}
