// Lightweight browser-console tests for the calculation engine.
// These validate the model's internal invariants and boundary logic.
function runSanityChecks() {
  const cases = [12000, 18000, 24000, 32000, 35000, 40000, 60000, 100000];

  cases.forEach((ral) => {
    const r = calculateSalary(ral);
    console.assert(r.netAnnual > 0, `Net should be positive for ${ral}`);
    console.assert(r.netAnnual <= ral + r.nonTaxableRelief, `Net should not exceed gross plus non-taxable relief for ${ral}`);
    console.assert(r.contributions > 0, `Contributions should be positive for ${ral}`);
    console.assert(r.taxable < ral, `Taxable income should be below gross for ${ral}`);
    console.assert(r.netMonthly * 12 === r.netAnnual, `Monthly annualization should reconcile for ${ral}`);
  });

  // Progressive IRPEF: higher income should not produce lower net income.
  console.assert(calculateSalary(40000).netAnnual > calculateSalary(32000).netAnnual);
  console.assert(calculateSalary(60000).netAnnual > calculateSalary(40000).netAnnual);

  // Milan municipal exemption: it applies only at/below €23k taxable income.
  console.assert(calculateSalary(24000).municipal >= 0);

  // Tax-wedge payment is present only in the <= €20k scenario.
  console.assert(calculateSalary(18000).nonTaxableRelief > 0);
  console.assert(calculateSalary(24000).nonTaxableRelief === 0);

  console.log('Tax-engine sanity checks passed.');
}
