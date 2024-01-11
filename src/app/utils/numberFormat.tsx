export function formaterBelop(belop?: number): string {
  if (typeof belop === "number") {
    if (belop === 0) {
      return "kr. 0";
    }
    const desimaler = 2;
    const desimalSeparator = ",";
    const tusenSeparator = " ";
    const i = parseInt(
      Math.abs(Number(belop) || 0).toFixed(desimaler),
      10
    ).toString();
    const j = i.length > 3 ? i.length % 3 : 0;

    return (
      "kr. " +
      (j ? i.substr(0, j) + tusenSeparator : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + tusenSeparator) +
      (desimaler
        ? desimalSeparator +
          Math.abs(belop! - Number(i))
            .toFixed(desimaler)
            .slice(2)
        : "")
    );
  } else {
    return "kr. 0";
  }
}
