// plugins/coverageReporter.cjs
const { ReportBase } = require('istanbul-lib-report');
const path = require('node:path');

module.exports = class CustomCoveragePercentReporter extends ReportBase {
  constructor(opts = {}) {
    super();
    this.file = opts.file || 'coverage.yml';
    this.contentWriter = null;
  }

  onStart(root, context) {
    // ✅ Use the exact path handling you confirmed works
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
    // Helpers
    const pct = (v) =>
      typeof v === 'number' && !Number.isNaN(v) ? Math.round(v * 100) / 100 : 0;

    const rangeStr = (lines) => {
      if (!lines || !lines.length) return '';
      const sorted = [...lines].sort((a, b) => a - b);
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      return first === last ? `${first}` : `${first}-${last}`;
    };

    const relFromCwd = (absPath) => {
      try {
        const rel = path.relative(process.cwd(), absPath || '');
        return rel.split(path.sep).join('/'); // normalize separators
      } catch {
        return absPath || 'unknown';
      }
    };

    // Rollup totals
    const sum = root.getCoverageSummary();
    const totals = {
      statements: pct(sum.statements.pct),
      branches:   pct(sum.branches.pct),
      functions:  pct(sum.functions.pct),
      lines:      pct(sum.lines.pct),
    };
    const totalAvg = (totals.statements + totals.branches + totals.functions + totals.lines) / 4;

    const w = this.contentWriter;
    w.println(`coverage:`);
    w.println(`  totals:`);
    for (const k of ['statements', 'branches', 'functions', 'lines']) {
      w.println(`    ${k}: ${totals[k]}%`);
    }
    w.println(`    total: ${pct(totalAvg)}%`);

    // Build nested tree of files (keys relative to repo root)
    const tree = {}; // { [segment]: subtree | { __metrics } }
    const fileNodes = root.getChildren ? root.getChildren() : [];

    const ensurePath = (parts) => {
      let node = tree;
      for (const part of parts) {
        if (!node[part]) node[part] = {};
        node = node[part];
      }
      return node;
    };

    if (Array.isArray(fileNodes) && fileNodes.length) {
      fileNodes.forEach((node) => {
        if (typeof node.getFileCoverage !== 'function') return;

        // Canonical path from Istanbul; print as path relative to project root
        const fc = node.getFileCoverage();
        const absPath = (fc && (fc.path || (fc.data && fc.data.path))) || null;
        const relPath = absPath ? relFromCwd(absPath) : (node.displayShortName || node.name || 'unknown');
        const parts = relPath.split('/').filter(Boolean);

        // Per-file totals
        const fsu = node.getCoverageSummary ? node.getCoverageSummary() : {};
        const fileTotals = {
          statements: pct(fsu?.statements?.pct),
          branches:   pct(fsu?.branches?.pct),
          functions:  pct(fsu?.functions?.pct),
          lines:      pct(fsu?.lines?.pct),
        };

        // Uncovered lines
        let uncovered = [];
        if (fc) {
          if (typeof fc.getUncoveredLines === 'function') {
            uncovered = fc.getUncoveredLines();
          } else if (typeof fc.getLineCoverage === 'function') {
            const lineMap = fc.getLineCoverage();
            uncovered = Object.entries(lineMap)
              .filter(([, hits]) => hits === 0)
              .map(([line]) => Number(line));
          }
        }

        // Attach metrics at the leaf
        const leaf = ensurePath(parts);
        leaf.__metrics = {
          ...fileTotals,
          uncovered_line_numbers: rangeStr(uncovered) || undefined, // omit if empty
        };
      });
    }

    // Emit nested YAML under "files:"
    const printTree = (node, indent = 2) => {
      const keys = Object.keys(node).filter((k) => k !== '__metrics').sort();
      for (const key of keys) {
        w.println(`${' '.repeat(indent)}${key}:`);
        printTree(node[key], indent + 2);
      }
      if (node.__metrics) {
        const m = node.__metrics;
        for (const k of ['statements', 'branches', 'functions', 'lines']) {
          w.println(`${' '.repeat(indent)}${k}: ${m[k]}%`);
        }
        if (m.uncovered_line_numbers) {
          w.println(`${' '.repeat(indent)}uncovered_line_numbers: "${m.uncovered_line_numbers}"`);
        }
      }
    };

    w.println(`  files:`);
    printTree(tree, 4); // start files’ children at 4 spaces
    w.close();
  }
};
