import { CssObject, Nullable } from "../../../library/index.js";

/* eslint-disable no-unused-vars */
export enum ThemeType {
  Dark = "dark",
  Black = "black",
  Light = "light",
  Default = "default",
}
/* eslint-enable no-unused-vars */

export class CustomCss {
  dark: CssObject = new CssObject({ "@media all and (min-width: 1024px)": { html: { background: "#212121", }, }, }, "gim");
  black: CssObject = new CssObject({ "@media all and (min-width: 1024px)": { html: { background: "#000", }, }, }, "gim");
  light: CssObject = new CssObject({ "@media all and (min-width: 1024px)": { html: { background: "#fff", }, }, "#content": { color: "#000" } }, "gim");
  getType(type: ThemeType): string {
    switch (type) {
      case ThemeType.Dark:
        return this.dark.toString();
      case ThemeType.Black:
        return this.black.toString();
      case ThemeType.Light:
        return this.light.toString();
      default:
        return "";
    }
  }

  replace(text: string, type: ThemeType): string {
    if (this.dark.toRegExp().test(text)) {
      return text.replace(this.dark.toRegExp(), this.getType(type));
    }

    if (this.black.toRegExp().test(text)) {
      return text.replace(this.black.toRegExp(), this.getType(type));
    }

    if (this.light.toRegExp().test(text)) {
      return text.replace(this.light.toRegExp(), this.getType(type));
    }

    return `${text}${this.getType(type)}`;
  }
}

export interface EventKey {
  key: ThemeType;
}

export class CssKeys {
  customCss: CustomCss;
  insertCss(object?: Nullable<EventKey>) {
    /* Unknown code.
     * const currentCSS = $("style#customCSS-NekoBoiNick").html();
     */
    if ($("head style#customCSS-NekoBoiNick").length === 0) {
      const cssBlock: CssObject = new CssObject({
        "button#copyLodestoneCode": {
          border: 0,
          bottom: "2px",
          position: "relative",
        },
        "#content ul li": {
          lineHeight: "32px",
        },
        "#compactCards img": {
          maxWidth: "40px",
        },
      });

      $("head").appendCssBlock(cssBlock, "customCSS-NekoBoiNick");
    } else if (object && object !== null) {
      $("head style#customCSS-NekoBoiNick").text(this.customCss.replace($("head style#customCSS-NekoBoiNick").text().toString(), object.key));
    }
  }

  constructor() { this.customCss = new CustomCss(); }
}
