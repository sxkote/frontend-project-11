import { string } from 'yup';

const defineErrorType = (errorText) => {
  if (errorText === 'this must be a valid URL') {
    return 'url-format';
  }

  if (errorText.indexOf('this must not be one of the following values') === 0) {
    return 'url-duplicate';
  }

  return 'format';
};

export default (url, existingUrls) => {
  const schema = string().required().url().notOneOf(existingUrls);
  return schema.validate(url).catch((error) => {
    // console.log('ERROR: ');
    // console.dir(error);
    const exception = new Error(error);
    exception.type = defineErrorType(error.message);
    throw exception;
  });
};
