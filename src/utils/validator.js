import { string, setLocale } from 'yup';

setLocale({
  string: {
    url: 'errors.notValidUrl',
  },
  mixed: {
    required: 'errors.emptyUrl',
    notOneOf: 'errors.alreadyExistsUrl',
  },
});

export default (url, existingUrls) => {
  const schema = string().required().url().notOneOf(existingUrls);
  return schema.validate(url).catch((error) => {
    throw new Error(error.message);
  });
};
