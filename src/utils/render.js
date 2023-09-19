const setFeedBack = (elements, style, text) => {
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.remove('text-warning');
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add(style);
  elements.feedback.textContent = text;
};

const renderStateFeedFetching = (elements, i18next) => {
  elements.submit.disabled = true;
  elements.urlInput.classList.remove('is-invalid');
  setFeedBack(elements, 'text-warning', i18next.t('status.fetching'));
};

const renderStateFeedAdded = (elements, i18next) => {
  elements.submit.disabled = false;
  elements.form.reset();
  elements.urlInput.classList.remove('is-invalid');
  elements.urlInput.focus();
  setFeedBack(elements, 'text-success', i18next.t('status.added'));
};

const renderStateInputError = (elements, errorText) => {
  elements.submit.disabled = false;
  elements.urlInput.classList.add('is-invalid');
  setFeedBack(elements, 'text-danger', errorText);
};

const renderState = (elements, i18next, value) => {
  switch (value) {
    case 'feed-fetching':
      renderStateFeedFetching(elements, i18next);
      break;
    case 'feed-added':
      renderStateFeedAdded(elements, i18next);
      break;
    case 'input-error':
      renderStateInputError(elements, '');
      break;
    default:
      break;
  }
};

const renderError = (elements, errorText) => {
  // if (errorText === null) {
  //   return;
  // }
  setFeedBack(elements, 'text-danger', errorText);
};

const render = (elements, i18next) => (path, value) => {
  switch (path) {
    case 'formState':
      renderState(elements, i18next, value);
      break;
    case 'error':
      renderError(elements, value);
      break;
    default:
      break;
  }
};

export default render;
