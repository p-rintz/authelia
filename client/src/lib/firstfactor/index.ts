import FirstFactorValidator = require("./FirstFactorValidator");
import JSLogger = require("js-logger");
import UISelectors = require("./UISelectors");
import { Notifier } from "../Notifier";
import { QueryParametersRetriever } from "../QueryParametersRetriever";
import Constants = require("../../../../shared/constants");
import Endpoints = require("../../../../shared/api");
import UserMessages = require("../../../../shared/UserMessages");

export default function (window: Window, $: JQueryStatic,
  firstFactorValidator: typeof FirstFactorValidator, jslogger: typeof JSLogger) {

  const notifier = new Notifier(".notification", $);

  function onFormSubmitted() {
    const username: string = $(UISelectors.USERNAME_FIELD_ID).val() as string;
    const password: string = $(UISelectors.PASSWORD_FIELD_ID).val() as string;

    $("form").css("opacity", 0.5);
    $("input,button").attr("disabled", "true");
    $(UISelectors.SIGN_IN_BUTTON_ID).text("Please wait...");

    const redirectUrl = QueryParametersRetriever.get(Constants.REDIRECT_QUERY_PARAM);
    firstFactorValidator.validate(username, password, redirectUrl, $)
      .then(onFirstFactorSuccess, onFirstFactorFailure);
    return false;
  }

  function onFirstFactorSuccess(redirectUrl: string) {
    window.location.href = redirectUrl;
  }

  function onFirstFactorFailure(err: Error) {
    $("input,button").removeAttr("disabled");
    $("form").css("opacity", 1);
    notifier.error(UserMessages.AUTHENTICATION_FAILED);
    $(UISelectors.PASSWORD_FIELD_ID).select();
    $(UISelectors.SIGN_IN_BUTTON_ID).text("Sign in");
  }

  $(window.document).ready(function () {
    $("form").on("submit", onFormSubmitted);
  });
}

