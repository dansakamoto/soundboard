export function isValidNumber(s: string) {
  const validSteps = ["兆", "億", "万"];
  let test = "";

  if (s === "") return false;

  for (const c of s) {
    if (validSteps.includes(c)) {
      if (test === "" || !isValidSmallChunk(test)) return false;

      test = "";

      while (validSteps[0] !== c) validSteps.shift();
      validSteps.shift();
    } else {
      test += c;
    }
  }

  if (test === "") return true;

  return isValidSmallChunk(test);
}

function isValidSmallChunk(s: string) {
  let singleValid = true;
  const validDigits = ["二", "三", "四", "五", "六", "七", "八", "九"];
  const validSteps = ["千", "百", "十"];

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (c === "一" && singleValid) {
      if (i === s.length - 1) return true;
      return false;
    }

    if (validDigits.includes(c)) {
      if (!singleValid) return false;

      singleValid = false;
      continue;
    }

    if (validSteps.includes(c)) {
      singleValid = true;
      while (validSteps[0] !== c) validSteps.shift();
      validSteps.shift();
      continue;
    }

    return false;
  }

  return true;
}
