import onChange from 'on-change';
import validateUrl from './utils/validator.js';
import { fetchFeedFromUrl, parseFeedData } from './utils/fetch-data.js';
import render from './utils/render.js';

const handleError = (error) => {
  if (error.type === 'parse-feed') {
    return 'Не верный формат RSS!';
  }

  if (error.type === 'url-format') {
    return 'Ссылка должна быть валидным URL!';
  }

  if (error.type === 'url-duplicate') {
    return 'Данный URL уже добавлен!';
  }

  return 'Произошла непредвиденная ошибка в приложении!';
};

const handleNewFeedData = (data, watchedState) => {
  watchedState.feeds.push(data.feed);
  watchedState.posts.push(...data.posts);
};

const app = () => {
  const state = {
    formState: 'empty',
    error: null,
    feeds: [],
    posts: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    urlInput: document.querySelector('#url-input'),
    submit: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modal: document.querySelector('.modal'),
    modalHeader: document.querySelector('.modal-header'),
    modalBody: document.querySelector('.modal-body'),
  };

  const watchedState = onChange(state, render(elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const existingUrls = watchedState.feeds.map((feed) => feed.url);
    const formData = new FormData(e.target);
    const inputUrl = formData.get('url');
    validateUrl(inputUrl, existingUrls)
      .then(() => {
        watchedState.error = null;
        watchedState.formState = 'feed-fetching';
        return fetchFeedFromUrl(inputUrl);
      })
      .then((response) => {
        const feedData = parseFeedData(response.data.contents, inputUrl);
        handleNewFeedData(feedData, watchedState);
        watchedState.formState = 'feed-added';
      })
      .catch((error) => {
        watchedState.formState = 'input-error';
        watchedState.error = handleError(error);
      });
  });
};

export default app;
