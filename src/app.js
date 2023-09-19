import onChange from 'on-change';
import i18next from 'i18next';
import validateUrl from './utils/validator.js';
import { fetchFeedFromUrl, parseFeedDataWithIds } from './utils/rss.js';
import render from './utils/render.js';
import resources from './locales/resources.js';

const handleNewFeedData = (data, watchedState) => {
  watchedState.feeds.push(data.feed);
  watchedState.posts.push(...data.posts);
};

const app = () => {
  const i18options = {
    lng: 'ru',
    debug: true,
    resources,
    supportedLngs: ['ru', 'en'],
    fallbackLng: 'ru',
  };

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

  const i18instance = i18next.createInstance();

  const watchedState = onChange(state, render(elements, i18instance));

  const getErrorText = (error) => (!error || !error.message ? '' : i18instance.t(error.message));

  const submit = (e) => {
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
        const feedData = parseFeedDataWithIds(response.data.contents, inputUrl);
        handleNewFeedData(feedData, watchedState);
        watchedState.formState = 'feed-added';
      })
      .catch((error) => {
        watchedState.formState = 'input-error';
        watchedState.error = getErrorText(error);
      });
  };

  i18instance.init(i18options).then(() => {
    elements.form.addEventListener('submit', submit);
  });
};

export default app;
