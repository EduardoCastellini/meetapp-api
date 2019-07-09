import { isBefore } from 'date-fns';
import * as Yup from 'yup';
import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const meetup = await Meetup.findAll({
      where: { user_id: req.userId },
    });
    return res.json({ meetup });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { title, description, location, date } = req.body;
    const { originalname: name, filename: path } = req.file;

    /**
     * Check for past date
     */
    if (isBefore(date, new Date())) {
      return res.status(400).json({ error: 'Past dates ere not permitted!' });
    }

    const { id } = await File.create({ name, path });
    const bannerId = id;

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      user_id: req.userId,
      banner_id: bannerId,
    });

    return res.json({ meetup });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const meetup = await Meetup.findByPk(req.params.meetupId);
    /**
     * Check for user
     */
    if (meetup.user_id !== req.userId) {
      return res
        .status(501)
        .json({ error: 'User not authorized to change is meetup' });
    }
    /**
     * Check for past date
     */
    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: 'Past dates ere not permitted!' });
    }

    /**
     * Update
     */
    const meetupUpdate = await meetup.update(req.body);

    return res.json(meetupUpdate);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId);

    if (meetup.user_id !== req.userId) {
      return res.status(500).json({ error: 'User not authorized' });
    }

    const { id } = await meetup.destroy();

    return res.json({ id });
  }
}

export default new MeetupController();
