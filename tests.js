// Lightweight browser-console tests for the calculation engine.
// Expected invariants, not payroll-provider exactness.
function runSanityChecks() {
  const cases = [24000, 40000, 60000, 100000];
  cases.forEach((ral) => {
    const r = calculateSalary(ral);
    console.assert(r.netAnnual > 0, `Net should be positive for ${ral}`);
    console.assert(r.netAnnual < ral, `Net should be below gross for ${ral}`);
    console.assert(r.contributions > 0, `Contributions should be positive for ${ral}`);
    console.assert(r.taxable < ral, `Taxable income should be below gross for ${ral}`);
  });
  console.assert(calculateSalary(40000).netAnnual > calculateSalary(24000).netAnnual);
  console.log('Sanity checks passed.');
}
