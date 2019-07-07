import { isBefore } from 'date-fns';
import Meetup from '../models/Meetup';
import Subscrption from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId);

    /**
     * Check for past date
     */
    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: 'Past dates ere not permitted!' });
    }

    console.log(meetup.id);
    console.log(req.userId);

    const subscrption = await Subscrption.create({
      meetup_id: meetup.id,
      user_id: req.userId,
    });

    return res.json({ subscrption });
  }
}

export default new SubscriptionController();
