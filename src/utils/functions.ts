export const filterNumericInput = (val) => {
  let clean = val.replace(/[^0-9.,]/g, "");

  const separators = clean.match(/[.,]/g);
  if (separators && separators.length > 1) {
    return clean.slice(0, -1);
  }

  if (clean === "." || clean === ",") {
    clean = "0" + clean;
  }

  return clean;
};
