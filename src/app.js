import onChange from 'on-change';
import i18next from 'i18next';
import { uniqueId } from 'lodash';
import validateUrl from './utils/validator.js';
import { fetchFeedFromUrl, parseFeedData, parseFeedDataWithIds } from './utils/rss.js';
import render from './utils/render.js';
import resources from './locales/resources.js';

const app = () => {
  const i18options = {
    lng: 'ru',
    debug: false,
    resources,
    supportedLngs: ['ru', 'en'],
    fallbackLng: 'ru',
  };

  const state = {
    language: i18options.lng,
    formState: 'empty',
    error: null,
    feeds: [],
    posts: [],
    readPosts: [],
    viewPost: null,
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    urlInput: document.querySelector('#url-input'),
    submit: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modal: {
      root: document.querySelector('.modal'),
      header: document.querySelector('.modal-header'),
      body: document.querySelector('.modal-body'),
      href: document.querySelector('.full-article'),
      close: document.querySelector('.modal-footer button.btn-secondary'),
    },
    langRU: document.querySelector('#lang-ru'),
    langEN: document.querySelector('#lang-en'),
    labels: {
      header: document.querySelector('#section-form h1'),
      subheader: document.querySelector('#section-form p.lead'),
      example: document.querySelector('#section-form p.text-muted'),
    },
  };

  const i18instance = i18next.createInstance();

  const watchedState = onChange(state, render(state, elements, i18instance));

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
        watchedState.feeds.push(feedData.feed);
        watchedState.posts.push(...feedData.posts);
        watchedState.formState = 'feed-added';
      })
      .catch((error) => {
        watchedState.formState = 'failed';
        watchedState.error = error?.message ?? 'errors.unknown';
      });
  };

  const viewPost = (postId) => {
    if (!postId) return;
    watchedState.viewPost = watchedState.posts.find((p) => p.id === postId);
    watchedState.readPosts.push(postId);
  };

  const refreshPosts = () => {
    const promises = watchedState.feeds.map((feed) => fetchFeedFromUrl(feed.url)
      .then((response) => {
        const feedData = parseFeedData(response.data.contents);
        const currentPostLinks = watchedState.posts
          .filter((post) => post.feedId === feed.id)
          .map((post) => post.link);
        const newPosts = feedData.posts.filter((post) => !currentPostLinks.includes(post.link));
        newPosts.forEach((post) => {
          post.id = uniqueId();
          post.feedId = feed.id;
        });
        watchedState.posts.unshift(...newPosts);
      })
      .catch((error) => {
        console.error(`Error fetching data from feed ${feed.id}:`, error);
      }));
    return Promise.all(promises).finally(() => setTimeout(refreshPosts, 5000));
  };

  const changeLanguage = (lang) => {
    i18instance.changeLanguage(lang).then(() => {
      watchedState.language = lang;
    });
  };

  i18instance.init(i18options).then(() => {
    elements.form.addEventListener('submit', submit);
    elements.posts.addEventListener('click', (e) => viewPost(e.target.dataset.id));
    elements.langEN.addEventListener('click', () => changeLanguage('en'));
    elements.langRU.addEventListener('click', () => changeLanguage('ru'));

    refreshPosts();
  });
};

export default app;
