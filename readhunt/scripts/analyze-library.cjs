#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const byGrade = {};
const themesByGrade = {};

lib.forEach(item => {
  const g = item.grade;
  if (!byGrade[g]) {
    byGrade[g] = 0;
    themesByGrade[g] = new Set();
  }
  byGrade[g]++;
  if (item.theme) {
    themesByGrade[g].add(item.theme);
  }
});

console.log('Texter per årskurs:');
Object.entries(byGrade)
  .sort((a, b) => a[0] - b[0])
  .forEach(([k, v]) => {
    const themes = Array.from(themesByGrade[k]).join(', ');
    console.log(`Åk ${k}: ${v} texter (Teman: ${themes || 'inga'})`);
  });

console.log(`\nTotalt: ${lib.length} texter`);
