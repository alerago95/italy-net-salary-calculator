/*
 * 2026 rules for the Jet HR prototype.
 * Scope: standard private-sector employee, indefinite contract, Milan resident,
 * full year, no dependants, no other income and no special individual benefits.
 *
 * The employee contribution rate is deliberately an explicit prototype assumption:
 * actual payroll rates can vary by sector/category and other circumstances.
 */
const TAX_RULES = {
  year: 2026,
  employeeContributionRate: 0.0919,

  // 2026 IRPEF: 23% / 35% / 43%.
  irpefBrackets: [
    { upTo: 28000, rate: 0.23 },
    { upTo: 50000, rate: 0.35 },
    { upTo: Infinity, rate: 0.43 }
  ],

  employeeDeduction: (taxable) => {
    if (taxable <= 15000) return 1955;
    if (taxable <= 28000) return 1910 + 1190 * (28000 - taxable) / 13000;
    if (taxable <= 50000) return 1910 * (50000 - taxable) / 22000;
    return 0;
  },

  // 2025-2026 reduction of the tax wedge: this amount does not form part of
  // taxable employment income for employees in the relevant income bands.
  nonTaxableEmployeeRelief: (employmentIncome) => {
    if (employmentIncome <= 8500) return employmentIncome * 0.071;
    if (employmentIncome <= 15000) return employmentIncome * 0.053;
    if (employmentIncome <= 20000) return employmentIncome * 0.048;
    return 0;
  },

  // Additional employee deduction for total income > €20k and <= €40k.
  additionalEmployeeDeduction: (grossIncome) => {
    if (grossIncome > 20000 && grossIncome <= 32000) return 1000;
    if (grossIncome > 32000 && grossIncome <= 40000) return 1000 * (40000 - grossIncome) / 8000;
    return 0;
  },

  // The employee-work deduction is increased by €65 for income > €25k and <= €35k.
  employeeDeductionExtra65: (grossIncome) =>
    grossIncome > 25000 && grossIncome <= 35000 ? 65 : 0,

  lombardyRegionalBrackets: [
    { upTo: 15000, rate: 0.0123 },
    { upTo: 28000, rate: 0.0158 },
    { upTo: 50000, rate: 0.0172 },
    { upTo: Infinity, rate: 0.0173 }
  ],

  milanMunicipalRate: 0.008,
  milanMunicipalExemption: 23000,
  currency: 'EUR'
};