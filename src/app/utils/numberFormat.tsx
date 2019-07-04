export function formaterBelop(belop?: number): string {
  if (typeof belop === 'number') {
    if (belop === 0) {
      return '';
    }
    let desimaler = 2;
    let desimalSeparator = ',';
    let tusenSeparator = ' ';
    let i = parseInt(Math.abs(Number(belop) || 0).toFixed(desimaler), 10).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      'kr. ' +
      (j ? i.substr(0, j) + tusenSeparator : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + tusenSeparator) +
      (desimaler
        ? desimalSeparator +
          Math.abs(belop! - Number(i))
            .toFixed(desimaler)
            .slice(2)
        : '')
    );
  } else {
    return '';
  }
}
