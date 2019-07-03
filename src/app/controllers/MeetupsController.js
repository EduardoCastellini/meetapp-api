import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupsController {
  async store(req, res) {
    const { title, description, location, date } = req.body;

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    const { bannerId } = file;

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      bonner_id: bannerId,
    });

    res.json({ meetup });
  }
}

export default new MeetupsController();
