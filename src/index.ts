export default async function (options: Options) {
  options.value ??= true;
  let techs: any[];
  (window as any).postMessageUnbounded = window.postMessage;
  (window.postMessage as any) = (...args: any[]) => {
    if (args[0].wappalyzer) {
      if (techs) {
        if (args[0].wappalyzer.js) {
          if (options.debug)
            console.log("injecting js, original is", args[0].wappalyzer.js);
          args[0].wappalyzer.js = techs.reduce((accumulator, currentValue) => {
            if (typeof options.value === "function") {
              currentValue.value = options.value(currentValue, "js");
            } else {
              currentValue.value = options.value;
            }
            if (currentValue.chains) {
              currentValue.chain = currentValue.chains;
              delete currentValue.chains;
            }
            accumulator.push(currentValue);
            return accumulator;
          }, []);
        }
        if (args[0].wappalyzer.dom) {
          if (options.debug)
            console.log("injecting dom, original is", args[0].wappalyzer.dom);
          let newTech = [];
          for (let tech of techs) {
            newTech.push({
              name: tech.name,
              selector: Object.keys(tech.dom)[0],
              property: Object.values(tech.dom)[0],
              value:
                typeof options.value === "function"
                  ? options.value(tech, "dom")
                  : options.value,
            });
          }
          args[0].wappalyzer.dom = newTech;
        }
      }
    }
    ((window as any).postMessageUnbounded as any)(...args);
  };
  window.addEventListener("message", (e) => {
    if (!e.data.wappalyzer || !e.data.wappalyzer.technologies) {
      return;
    }
    techs = e.data.wappalyzer.technologies;
  });
}
interface Options {
  debug?: boolean;
  value:
    | number
    | boolean
    | ((tech: any, type: "dom" | "js") => number | boolean);
}
