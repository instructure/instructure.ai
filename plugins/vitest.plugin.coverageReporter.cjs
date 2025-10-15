// plugins/coverageReporter.cjs
const { ReportBase } = require('istanbul-lib-report');
const path = require('node:path');

module.exports = class CustomCoveragePercentReporter extends ReportBase {
  constructor(opts) {
    super();
    this.file = opts.file || 'coverage.yml';
  }

  onStart(root, context) {
    let outFile = this.file;
    if (path.isAbsolute(outFile)) {
      outFile = path.relative(context.dir, outFile);
    }

    if (outFile.startsWith('..')) {
      outFile = path.basename(outFile);
    }

    this.contentWriter = context.writer.writeFile(outFile);
  }

  onEnd(root) {
    const summary = root.getCoverageSummary();
    const totals = {
      statements: summary.statements.pct,
      branches: summary.branches.pct,
      lines: summary.lines.pct,
      functions: summary.functions.pct
    };
    const total = (
      totals.statements + totals.branches + totals.lines + totals.functions
    ) / 4;
    this.contentWriter.println(`coverage:`);
    Object.entries(totals).forEach(([key, value]) => {
      this.contentWriter.println(`  ${key}: ${value}%`);
    });
    this.contentWriter.println(`  total: ${total}%`);
    this.contentWriter.close();
  }
};
