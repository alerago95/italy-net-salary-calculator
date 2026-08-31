/*
 * 2026 rules for the Jet HR prototype.
 * Scope: standard private-sector employee, indefinite contract, Milan resident,
 * full year, no dependants, no other income and no special individual benefits.
 *
 * The employee contribution rate is deliberately an explicit prototype assumption:
 * actual contribution rates can vary by sector/category and other circumstances.
 */
const TAX_RULES = {
  year: 2026,
  employeeContributionRate: 0.0919,

  // 2026 IRPEF: 23% / 33% / 43%.
  irpefBrackets: [
    { upTo: 28000, rate: 0.23 },
    { upTo: 50000, rate: 0.33 },
    { upTo: Infinity, rate: 0.43 }
  ],

  // Employee-work deduction, annual full-year simplified case.
  employeeDeduction: (taxable) => {
    if (taxable <= 15000) return 1955;
    if (taxable <= 28000) return 1910 + 1190 * (28000 - taxable) / 13000;
    if (taxable <= 50000) return 1910 * (50000 - taxable) / 22000;
    return 0;
  },

  // Tax-wedge payment for employees with income up to €20,000.
  // It does not form part of taxable income and therefore is added to net cash.
  nonTaxableEmployeeRelief: (employmentIncome) => {
    if (employmentIncome <= 8500) return employmentIncome * 0.071;
    if (employmentIncome <= 15000) return employmentIncome * 0.053;
    if (employmentIncome <= 20000) return employmentIncome * 0.048;
    return 0;
  },

  // Additional employee deduction for overall/taxable income > €20,000 and <= €40,000.
  additionalEmployeeDeduction: (taxable) => {
    if (taxable > 20000 && taxable <= 32000) return 1000;
    if (taxable > 32000 && taxable <= 40000) return 1000 * (40000 - taxable) / 8000;
    return 0;
  },

  // The employee-work deduction is increased by €65 when overall income is > €25,000 and <= €35,000.
  employeeDeductionExtra65: (taxable) =>
    taxable > 25000 && taxable <= 35000 ? 65 : 0,

  // Lombardia 2026 regional IRPEF surcharge, progressive by income band.
  lombardyRegionalBrackets: [
    { upTo: 15000, rate: 0.0123 },
    { upTo: 28000, rate: 0.0158 },
    { upTo: 50000, rate: 0.0172 },
    { upTo: Infinity, rate: 0.0173 }
  ],

  // Milan: 0.8% single rate, with €23,000 income exemption.
  milanMunicipalRate: 0.008,
  milanMunicipalExemption: 23000,
  currency: 'EUR'
};