import i18n from "i18n";
import { join } from "path";
import intents from "./client/intents";
import partials from "./client/partials";

export const prefix = "t!";
export const owners = ["392164856817516545", "588933665719975956", "635701112510349312"];
export const guildId = "847644559138619392";
export const language = "pt-br";

i18n.configure({
    locales: [
      "en",
      "es",
      "pt-br"
    ],
    directory: join(__dirname, ".", "languages"),
    defaultLocale: "pt-br",
    retryInDefaultLocale: true,
    objectNotation: true,
    register: global,
  
    logWarnFn: function (msg) {
      console.log(msg);
    },
  
    logErrorFn: function (msg) {
      console.log(msg);
    },
  
    missingKeyFn: function (locale, value) {
      return value;
    },
  
    mustacheConfig: {
      tags: ["{{", "}}"],
      disable: false
    }
  });
export { intents, partials, i18n }
export default { intents, partials, owners, prefix, guildId, i18n, language };