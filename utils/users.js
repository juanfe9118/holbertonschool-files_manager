import redisClient from './redis';

async function getIdAndKey(req) {
  const userInfo = { userId: null, key: null };

  const token = req.header('X-Token');
  if (!token) return userInfo;

  userInfo.key = `auth_${token}`;
  userInfo.userId = await redisClient.get(userInfo.key);

  return userInfo;
}

export default getIdAndKey;
