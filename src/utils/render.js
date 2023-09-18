const setFeedBack = (elements, style, text) => {
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.remove('text-warning');
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add(style);
  elements.feedback.textContent = text;
};

const renderStateFeedFetching = (elements) => {
  elements.submit.disabled = true;
  elements.urlInput.classList.remove('is-invalid');
  setFeedBack(elements, 'text-warning', 'feed fetching...');
};

const renderStateFeedAdded = (elements) => {
  elements.submit.disabled = false;
  elements.form.reset();
  elements.urlInput.classList.remove('is-invalid');
  elements.urlInput.focus();
  setFeedBack(elements, 'text-success', 'feed added');
};

const renderStateInputError = (elements, error) => {
  elements.submit.disabled = false;
  elements.urlInput.classList.add('is-invalid');
  setFeedBack(elements, 'text-danger', error);
};

const renderState = (elements, value) => {
  switch (value) {
    case 'feed-fetching':
      renderStateFeedFetching(elements);
      break;
    case 'feed-added':
      renderStateFeedAdded(elements);
      break;
    case 'input-error':
      renderStateInputError(elements, '');
      break;
    default:
      break;
  }
};

const renderError = (elements, error) => {
  if (error === null) {
    return;
  }
  setFeedBack(elements, 'text-danger', error);
};

const render = (elements) => (path, value) => {
  switch (path) {
    case 'formState':
      renderState(elements, value);
      break;
    case 'error':
      renderError(elements, value);
      break;
    default:
      break;
  }
};

export default render;
