export default async function () {
  let techs: any[];
  (window as any).postMessageUnbounded = window.postMessage;
  (window.postMessage as any) = (...args: any[]) => {
    if (args[0].wappalyzer) {
      if (techs) {
        if (args[0].wappalyzer.js) {
          console.log("injecting, original is", args[0].wappalyzer.js);
          args[0].wappalyzer.js = techs.reduce((accumulator, currentValue) => {
            currentValue.value = true;
            if (currentValue.chains) {
              currentValue.chain = currentValue.chains;
              delete currentValue.chains;
            }
            accumulator.push(currentValue);
            return accumulator;
          }, []);
        }
      }
    }
    ((window as any).postMessageUnbounded as any)(...args);
  };
  techs = await new Promise((resolve) => {
    window.addEventListener("message", (e) => {
      if (!e.data.wappalyzer || !e.data.wappalyzer.technologies) {
        return;
      }
      const technologies: any[] = e.data.wappalyzer.technologies;

      resolve(technologies);
    });
  });
}
