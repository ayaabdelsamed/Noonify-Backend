// eslint-disable-next-line import/prefer-default-export
export const sanitizeUser = function(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email
  };
};