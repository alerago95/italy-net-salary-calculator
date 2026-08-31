function formatEUR(value) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function calculateIrpef(taxable) {
  let previous = 0;
  let tax = 0;
  for (const bracket of TAX_RULES.irpefBrackets) {
    const portion = Math.max(0, Math.min(taxable, bracket.upTo) - previous);
    tax += portion * bracket.rate;
    if (taxable <= bracket.upTo) break;
    previous = bracket.upTo;
  }
  return tax;
}

function calculateSalary(ral) {
  const contributions = ral * TAX_RULES.employeeContributionRate;
  const taxable = Math.max(0, ral - contributions);
  const grossIrpef = calculateIrpef(taxable);
  const deduction = Math.min(grossIrpef, Math.max(0, TAX_RULES.employeeDeduction(taxable)));
  const netIrpef = Math.max(0, grossIrpef - deduction);
  const regional = taxable * TAX_RULES.lombardyRegionalRate;
  const municipal = taxable * TAX_RULES.milanMunicipalRate;
  const totalWithholding = contributions + netIrpef + regional + municipal;
  const netAnnual = Math.max(0, ral - totalWithholding);
  return { ral, contributions, taxable, grossIrpef, deduction, netIrpef, regional, municipal, totalWithholding, netAnnual, netMonthly: netAnnual / 12, effectiveRate: totalWithholding / ral };
}

function render(result) {
  const set = (id, value) => document.getElementById(id).textContent = value;
  set('netAnnual', formatEUR(result.netAnnual));
  set('netMonthly', formatEUR(result.netMonthly));
  set('gross', formatEUR(result.ral));
  set('inps', `− ${formatEUR(result.contributions)}`);
  set('taxable', formatEUR(result.taxable));
  set('grossIrfpef', `− ${formatEUR(result.grossIrpef)}`);
  set('deduction', `+ ${formatEUR(result.deduction)}`);
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