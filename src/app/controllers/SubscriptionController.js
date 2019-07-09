import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscrption from '../models/Subscription';

import Mail from '../../lib/Mail';

class SubscriptionController {
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
    });

    /**
     * Check for past date
     */
    if (meetup.past) {
      return res.status(400).json({ error: 'Past dates ere not permitted!' });
    }

    /**
     * User organizer
     */
    if (meetup.user_id === req.userId) {
      return res.status(400).json({ error: 'User not allowed' });
    }

    /**
     *User
     */
    const userSubscription = await Subscrption.findOne({
      where: {
        meetup_id: meetup.id,
        user_id: req.userId,
      },
    });

    if (userSubscription !== null) {
      return res.status(400).json({ error: 'User already registered' });
    }

    /**
     * Subscription
     */
    const subscrption = await Subscrption.create({
      meetup_id: meetup.id,
      user_id: req.userId,
    });

    const { name } = await User.findByPk(req.userId);
    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: `Nova Inscrição`,
      template: 'subscription',
      context: {
        userMeetap: meetup.User.name,
        user: name,
        meetap: meetup.title,
      },
    });

    return res.json({ subscrption });
  }

  async index(req, res) {
    const subscrptions = await Subscrption.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          attributes: ['title', 'description', 'date', 'location'],
          order: ['date'],
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json({ subscrptions });
  }
}

export default new SubscriptionController();
