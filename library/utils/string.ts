import { JQuery } from "./jquery.js";
import unidecode from "unidecode";

// cSpell:ignoreRegExp /Bibo(?=\\\+|\+|-Plus)/

export function transliterate(word: string): string {
  return unidecode(word);

  /* Disabled:
  let answer: string = "";

  for (const i in word.split("")) {
    const translated = translateCharacter(word[i])
    if (typeof translated === undefined) {
      answer += word[i];
    } else {
      answer += translated;
    }
  }

  return answer;
  */
}

export function checkEveryLetter(name: string) {
  let newName: string = "";

  for (let i = 0; i < name.length; i++) {
    const code: number | undefined = name.codePointAt(i);

    if (!code) continue;

    if (code - 119808 >= 0 && code - 119808 < 1025) {
      newName += String.fromCodePoint(((code - 119808) % 52) + 65);
    } else if (code >= 56745 || (code >= 9728 && code <= (9728 + 1024))) {
      newName = newName.toString();
    } else {
      newName += transliterate(String.fromCodePoint(code));
    }
  }

  return newName;
}

export function modifyModAuthorName(name: string): string {
  return checkEveryLetter(name
    .replace(/\s/g, "_")
    .replace(/[[(\]){}.]/g, ""))
    /* eslint no-control-regex: off */
    .replace(/\s?[\u0000-\u001F\u007B-\uFFFF]\s?/g, "");
}

export function modifyModName(name: string): string {
  return name
  .replace(/Bibo\+/gi, "Bibo-Plus")
  .replace(/B\+/gi, "Bibo-Plus")
  .replace(/\s?[[(]TBSE(\/FTM)?[\])]/gi, "-TBSE$1")
  .replace(/TBSE\/(FTM)/gi, "TBSE-$1")
  .replace(/\s?\[([^\]]+)\]$/g, "-$1")
  .replace(/\s?\(F\)$/gi, "-Female")
  .replace(/\s?\(M\)$/gi, "-Female")
  .replace(/\s-\s|\.|\s\/\s/g, "-")
  .replace(/\sand\s|\s?&\s?/gi, "+")
  .replace(/Hair (\d+)(\+\d+)/gi, "Hair-$1$2")
  .replace(/\s#(\d+)/g, "-$1")
  .replace(/\s\(All\sFaces\)/gi, "-All_Faces")
  .replace(/\[([^\]]+)\]\s?(.*)/g, "$2-$1")
  .replace(/\s[\u0000-\u001F\u007B-\uFFFF]\s/g, "-")
  .replace(/['?\\/*:"<>|,!]/g, "")
  .replace(/\s?[\u0000-\u001F\u007B-\uFFFF]\s?/g, "")
  .replace(/\s/g, "_");
}

export function measureStringWidth(text: string, font?: string, size?: number | string): number | undefined {
  const fnt: string = font || "arial";
  const str: string = typeof size === "number" ? `${size}pt` : size || "12px";
  const out: JQuery<HTMLSpanElement> = $("<span></span>")
    .text(text)
    .css({ position: "absolute", float: "left", whiteSpace: "nowrap", visibility: "hidden", font: `${str} ${fnt}` })
    .appendTo($("body"));
  const w: number | undefined = out.width();

  out.remove();

  return w;
}
