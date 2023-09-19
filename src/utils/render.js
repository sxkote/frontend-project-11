const buildElement = (tag, ...classes) => {
  const element = document.createElement(tag);
  element.classList.add(classes);
  return element;
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

const buildPost = (post) => {
  const li = buildElement(
    'li',
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );
  const a = buildElement('a', 'fw-bold');
  a.setAttribute('href', post.link);
  a.setAttribute('data-id', post.id);
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  a.textContent = post.title;
  li.append(a);
  return li;
};

const buildList = (type, items, i18next) => {
  const card = buildElement('div', 'card', 'border-0');
  const cardBody = buildElement('div', 'card-body');
  const cardTitle = buildElement('h2', 'card-title', 'h4');
  const list = buildElement('ul', 'list-group', 'border-0', 'rounded-0');
  cardTitle.textContent = i18next.t(`labels.${type}`);
  items.forEach((i) => {
    if (type === 'feeds') list.append(buildFeed(i));
    if (type === 'posts') list.append(buildPost(i));
  });
  cardBody.append(cardTitle);
  card.append(cardBody);
  card.append(list);
  return card;
};

const render = (elements, i18next) => (path, value) => {
  switch (path) {
    case 'formState':
      renderState(elements, i18next, value);
      break;
    case 'error':
      renderError(elements, value);
      break;
    case 'feeds':
      console.dir(value);
      elements.feeds.innerHTML = '';
      elements.feeds.append(buildList('feeds', value, i18next));
      break;
    case 'posts':
      console.dir(value);
      elements.posts.innerHTML = '';
      elements.posts.append(buildList('posts', value, i18next));
      break;
    default:
      break;
  }
};

export default render;
