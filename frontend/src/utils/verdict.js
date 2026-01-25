export const normalizeVerdict = (value) => {
  const raw = String(value || '').toUpperCase();
  if (raw === 'PASS') return 'PASS';
  if (raw === 'FAIL') return 'FAIL';
  if (raw === 'NEEDS_REVIEW') return 'NEEDS_REVIEW';
  if (raw === 'CONDITIONAL' || raw === 'WARN') return 'NEEDS_REVIEW';
  return 'NEEDS_REVIEW';
};

export const formatVerdictLabel = (value) => {
  const verdict = normalizeVerdict(value);
  if (verdict === 'NEEDS_REVIEW') return 'Needs review';
  if (verdict === 'PASS') return 'Pass';
  if (verdict === 'FAIL') return 'Fail';
  return String(value || '');
};
