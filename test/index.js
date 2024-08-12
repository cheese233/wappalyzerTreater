import wappalyzerTreater from "../src/index";
wappalyzerTreater({
  value: function (tech) {
    if (tech.name == "Adyen") {
      return 114.514;
    } else {
      return true;
    }
  },
  debug: true,
});
window.onmessage = (e) => {
  console.log(e);
};
