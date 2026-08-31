function formatEUR(value) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function calculateProgressiveTax(income, brackets) {
  let previous = 0;
  let tax = 0;
  for (const bracket of brackets) {
    const portion = Math.max(0, Math.min(income, bracket.upTo) - previous);
    tax += portion * bracket.rate;
    if (income <= bracket.upTo) break;
    previous = bracket.upTo;
  }
  return tax;
}

function calculateSalary(ral) {
  // Simplified standard employee contribution assumption for the prototype.
  const contributions = ral * TAX_RULES.employeeContributionRate;

  // The tax-wedge payment is non-taxable; it is therefore added to the final
  // cash outcome rather than treated as a withholding.
  const nonTaxableRelief = TAX_RULES.nonTaxableEmployeeRelief(ral);
  const taxable = Math.max(0, ral - contributions - nonTaxableRelief);

  const grossIrpef = calculateProgressiveTax(taxable, TAX_RULES.irpefBrackets);

  // Income thresholds for employee deductions refer to taxable/overall income,
  // not to the contractual RAL before deductible social contributions.
  const baseDeduction = TAX_RULES.employeeDeduction(taxable);
  const extra65 = TAX_RULES.employeeDeductionExtra65(taxable);
  const employeeDeduction = baseDeduction + extra65;
  const additionalDeduction = TAX_RULES.additionalEmployeeDeduction(taxable);
  const totalDeductions = Math.min(grossIrpef, Math.max(0, employeeDeduction + additionalDeduction));
  const netIrpef = Math.max(0, grossIrpef - totalDeductions);

  const regional = calculateProgressiveTax(taxable, TAX_RULES.lombardyRegionalBrackets);
  const municipal = taxable <= TAX_RULES.milanMunicipalExemption
    ? 0
    : taxable * TAX_RULES.milanMunicipalRate;

  const totalWithholding = contributions + netIrpef + regional + municipal;
  const netAnnual = Math.max(0, ral - totalWithholding + nonTaxableRelief);

  return {
    ral,
    contributions,
    nonTaxableRelief,
    taxable,
    grossIrpef,
    employeeDeduction,
    additionalDeduction,
    totalDeductions,
    netIrpef,
    regional,
    municipal,
    totalWithholding,
    netAnnual,
    netMonthly: netAnnual / 12,
    effectiveRate: totalWithholding / ral
  };
}

function render(result) {
  const set = (id, value) => document.getElementById(id).textContent = value;
  set('netAnnual', formatEUR(result.netAnnual));
  set('netMonthly', formatEUR(result.netMonthly));
  set('gross', formatEUR(result.ral));
  set('inps', `− ${formatEUR(result.contributions)}`);
  set('taxable', formatEUR(result.taxable));
  set('grossIrfpef', `− ${formatEUR(result.grossIrpef)}`);
  set('deduction', `+ ${formatEUR(result.totalDeductions)}`);
  set('netIrfpef', `− ${formatEUR(result.netIrpef)}`);
  set('regional', `− ${formatEUR(result.regional)}`);
  set('municipal', `− ${formatEUR(result.municipal)}`);
  set('totalTax', `− ${formatEUR(result.totalWithholding)}`);
  set('netAnnual2', formatEUR(result.netAnnual));
  set('effectiveRate', `${(result.effectiveRate * 100).toFixed(1)}% trattenute effettive`);
  document.getElementById('details').classList.remove('hidden');
}

document.getElementById('calculate').addEventListener('click', () => {
  const ral = Number(document.getElementById('ral').value);
  const error = document.getElementById('error');
  if (!Number.isFinite(ral) || ral < 10000 || ral > 250000) {
    error.textContent = 'Inserisci una RAL compresa tra €10.000 e €250.000.';
    return;
  }
  error.textContent = '';
  render(calculateSalary(ral));
});

document.getElementById('ral').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') document.getElementById('calculate').click();
});

document.getElementById('calculate').click();