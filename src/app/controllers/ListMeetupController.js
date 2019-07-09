import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';

class ListMeetupController {
  async index(req, res) {
    const searchDate = req.query.date;

    const page = req.query.page || 1;

    const meetup = await Meetup.findAll({
      where: {
        date: { [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)] },
      },
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json({ meetup });
  }
}

export default new ListMeetupController();
