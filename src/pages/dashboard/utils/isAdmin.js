const isAdmin = (user) => {
  return ['Admin',].includes(user?.role);
};

export default isAdmin;
