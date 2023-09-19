import axios from 'axios';
import { uniqueId } from 'lodash';

export const fetchFeedFromUrl = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return axios.get(proxyUrl.toString()).catch(() => {
    throw new Error('errors.network');
  });
};

const parseFeedPost = (post) => {
  const link = post.querySelector('link').textContent;
  const title = post.querySelector('title').textContent;
  const description = post.querySelector('description').textContent;
  const date = post.querySelector('pubDate').textContent;
  return {
    link,
    title,
    description,
    date,
  };
};

export const parseFeedData = (data, url) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(data, 'text/xml');

  const parseError = document.querySelector('parsererror');
  if (parseError) {
    throw new Error('errors.notValidRSS');
  }

  const title = document.querySelector('title').textContent;
  const description = document.querySelector('description').textContent;

  return {
    feed: {
      url,
      title,
      description,
    },
    posts: [...document.querySelectorAll('item')].map(parseFeedPost),
  };
};

export const parseFeedDataWithIds = (data, url) => {
  const feedObject = parseFeedData(data, url);

  const feedId = uniqueId();
  feedObject.feed.id = feedId;
  feedObject.posts.forEach((p) => {
    p.id = uniqueId();
    p.feedId = feedId;
  });

  return feedObject;
};
