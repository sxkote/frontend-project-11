const buildElement = (tag, ...classes) => {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  return element;
};

const buildPostButton = (post, i18next) => {
  const button = buildElement('button', 'btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('type', 'button');
  button.setAttribute('data-id', post.id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = i18next.t('buttons.view');
  return button;
};

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

const renderModal = (elements, post) => {
  elements.modalHeader.textContent = post.title;
  elements.modalBody.textContent = post.description;
  elements.modalHref.setAttribute('href', post.link);
};

const buildFeed = (feed) => {
  const li = buildElement('li', 'list-group-item', 'border-0', 'border-end-0');
  const title = buildElement('h3', 'h6', 'm-0');
  title.textContent = feed.title;
  li.append(title);
  const p = buildElement('p', 'm-0', 'small', 'text-black-50');
  p.textContent = feed.description;
  li.append(p);
  return li;
};

const buildPost = (state, post, i18next) => {
  const li = buildElement(
    'li',
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );
  const a = buildElement('a', state.readPosts.some((id) => id === post.id) ? 'fw-normal' : 'fw-bold');
  a.setAttribute('href', post.link);
  a.setAttribute('data-id', post.id);
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  a.textContent = post.title;
  li.append(a);
  const button = buildPostButton(post, i18next);
  li.append(button);
  return li;
};

const buildList = (state, type, i18next) => {
  const items = state[type];
  const card = buildElement('div', 'card', 'border-0');
  const cardBody = buildElement('div', 'card-body');
  const cardTitle = buildElement('h2', 'card-title', 'h4');
  const list = buildElement('ul', 'list-group', 'border-0', 'rounded-0');
  cardTitle.textContent = i18next.t(`labels.${type}`);
  items.forEach((i) => {
    if (type === 'feeds') list.append(buildFeed(i));
    if (type === 'posts') list.append(buildPost(state, i, i18next));
  });
  cardBody.append(cardTitle);
  card.append(cardBody);
  card.append(list);
  return card;
};

const render = (state, elements, i18next) => (path, value) => {
  switch (path) {
    case 'formState':
      renderState(elements, i18next, value);
      break;
    case 'error':
      renderError(elements, value);
      break;
    case 'feeds':
      elements.feeds.innerHTML = '';
      elements.feeds.append(buildList(state, 'feeds', i18next));
      break;
    case 'posts':
    case 'readPosts':
      elements.posts.innerHTML = '';
      elements.posts.append(buildList(state, 'posts', i18next));
      break;
    case 'viewPost':
      renderModal(elements, value);
      break;
    default:
      break;
  }
};

export default render;
