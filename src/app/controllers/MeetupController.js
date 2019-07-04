import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { title, description, location, date } = req.body;

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

    res.json({ meetup });
  }
}

export default new MeetupController();
