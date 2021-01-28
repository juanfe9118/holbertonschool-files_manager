import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';

const userQ = new Queue('userQ');

class UsersController {
  static async postNew(req, res) {
    const { email, pass } = req.body;

    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!pass) return res.status(400).send({ error: 'Missing password' });
    const emailExists = await dbClient.users.findOne({ email });
    if (emailExists) return res.status(400).send({ error: 'Already exist' });

    const secPass = sha1(pass);

    const insertStat = await dbClient.users.insertOne({
      email,
      password: secPass,
    });

    const createdUser = {
      id: insertStat.insertedId,
      email,
    };

    await userQ.add({
      userId: insertStat.insertedId.toString(),
    });

    return res.status(201).send(createdUser);
  }
}

export default UsersController;
