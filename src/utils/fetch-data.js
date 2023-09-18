import axios from 'axios';

export const fetchFeedFromUrl = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return axios.get(proxyUrl.toString());
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
    const error = new Error(parseError.textContent);
    error.type = 'parse-feed';
    throw error;
  }

  const title = document.querySelector('title').textContent;
  const description = document.querySelector('description').textContent;

  const links = [];
  const items = document.querySelectorAll('item');

  items.forEach((item) => {
    const name = item.querySelector('title').textContent;
    const desc = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    links.push({
      title: name,
      description: desc,
      link,
    });
  });

  return {
    feed: {
      url,
      title,
      description,
    },
    posts: [...document.querySelectorAll('item')].map(parseFeedPost),
  };
};
