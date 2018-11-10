/* globals Mozilla */
const page = require("./page").page;
const { PromotionStrategy } = require("../../promotion-strategy.js");

let model;

exports.launch = function(m) {
  model = m;
  if (window.wantsauth) {
    if (window.wantsauth.getAuthData()) {
      updateModel(window.wantsauth.getAuthData());
    } else {
      window.wantsauth.addAuthDataListener((data) => {
        updateModel(data);
        render();
      });
    }
  }
  model.hasFxaOnboardingDialog = new PromotionStrategy().shouldShowOnboardingDialog();
  render();
};

function updateModel(authData) {
  Object.assign(model, authData);
  model.hasFxa = !!model.accountId;
}

function render() {
  page.render(model);
}

document.addEventListener("addon-present", () => {
  if (location.hash === "#hello") {
    document.dispatchEvent(new CustomEvent("request-onboarding"));
  } else if (location.hash === "#tour") {
    try {
      if (typeof Mozilla === "undefined") {
        // The UITour-lib.js library hasn't loaded yet
        let count = 10;
        const interval = setInterval(() => {
          if (typeof Mozilla === "undefined") {
            count--;
            if (count <= 0) {
              clearTimeout(interval);
              throw new Error("UITour-lib.js didn't load up after 1 second");
            }
            return;
          }
          clearTimeout(interval);
          Mozilla.UITour.showHighlight("screenshots");
        }, 100);
      } else {
        Mozilla.UITour.showHighlight("screenshots");
      }
    } catch (e) {
      console.warn("Attempted to start #tour on non-Firefox version or unsupported version");
      throw e;
    }
  }
});

document.dispatchEvent(new CustomEvent("request-addon-present"));

window.controller = exports;
