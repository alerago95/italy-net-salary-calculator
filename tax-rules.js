/*
 * Simplified 2026 rules for the Jet HR prototype.
 * Assumptions: private-sector employee, indefinite contract, Milan resident,
 * no personal tax credits/benefits, standard employee contribution rate.
 */
const TAX_RULES = {
  year: 2026,
  employeeContributionRate: 0.0919,
  irpefBrackets: [
    { upTo: 28000, rate: 0.23 },
    { upTo: 50000, rate: 0.33 },
    { upTo: Infinity, rate: 0.43 }
  ],
  // Standard employee-work deduction, implemented as a simplified annual formula.
  employeeDeduction: (taxable) => {
    if (taxable <= 15000) return 1955;
    if (taxable <= 28000) return 1910 + 1190 * (28000 - taxable) / 13000;
    if (taxable <= 50000) return 1910 * (50000 - taxable) / 22000;
    return 0;
  },
  // Simplified Lombardia regional surcharge assumption for this prototype.
  lombardyRegionalRate: 0.0173,
  milanMunicipalRate: 0.008,
  currency: 'EUR'
};