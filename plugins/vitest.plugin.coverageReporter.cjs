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
    // Helpers
    const pct = (v) => (typeof v === 'number' && !Number.isNaN(v) ? Math.round(v * 100) / 100 : 0);
    const rangeStr = (lines) => {
      if (!lines || !lines.length) return '';
      lines = [...lines].sort((a, b) => a - b);
      const first = lines[0], last = lines[lines.length - 1];
      return first === last ? `${first}` : `${first}-${last}`;
    };
    const relFromCwd = (absPath) => {
      try {
        const rel = path.relative(process.cwd(), absPath || '');
        // Normalize to forward slashes for nicer YAML keys
        return rel.split(path.sep).join('/');
      } catch {
        return absPath || 'unknown';
      }
    };

    // Print header + totals
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

    // Build a folder tree for files with metrics at leaves
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

        // Use the canonical file path, then convert to relative-from-project-root
        const fc = node.getFileCoverage();
        const absPath = (fc && (fc.path || (fc.data && fc.data.path))) || null;
        const relPath = absPath ? relFromCwd(absPath) : (node.displayShortName || node.name || 'unknown');
        const parts = relPath.split('/').filter(Boolean);

        // Per-file totals
        const fs = node.getCoverageSummary ? node.getCoverageSummary() : {};
        const fileTotals = {
          statements: pct(fs?.statements?.pct),
          branches:   pct(fs?.branches?.pct),
          functions:  pct(fs?.functions?.pct),
          lines:      pct(fs?.lines?.pct),
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

    // Print the tree as nested YAML under "files:"
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
