const express = require('express');
const axios = require('axios');
const { createEvent, getNewEvents, getAll, getEvent } = require('./queries');
const router = express.Router();

router.post('/events', async function(req, res, next) {
  const event = req.body;

  let error = false;

  const createdEventRes = await createEvent(event).catch(e => { error = true; });
  const createdEventId = createdEventRes.insertId;

  let createdEvent = await getEvent(createdEventId);
  createdEvent = {
    ...createdEvent,
    data : JSON.parse(createdEvent.data.replace(/'/g, "\""))
  };
  // console.log(createdEvent);



  // Send event to Authenticator
  axios.post('http://localhost:3010/events', createdEvent)
      .catch(e => { error = true; });
  
  // Send event to Questions
  axios.post('http://localhost:3011/events', createdEvent)
      .catch(e => { error = true; });

  // Send event to Answers
  axios.post('http://localhost:3012/events', createdEvent)
      .catch(e => { error = true; });

  if(error){
    return res.status(500).send({status: 'Event propagation failed'});
  }

  res.status(200).send({status: 'Event successfully propagated'});
});

router.post('/fetchEvents', async function(req, res) {
  const { id, timestamp, requester} = req.body;

  let events = await getNewEvents(id, timestamp);
  // const events = await getAll();
  // console.log(events);

  events = events.map(event => {
    let data = event.data.replace(/'/g, "\"");
    data = JSON.parse(data);

    return {
      id : event.id,
      timestamp : event.timestamp,
      type : event.type,
      data,
    };
  });

  // console.log(events);

  events.forEach(event => {
    axios.post(requester + '/events', event)
  });

  res.send(events);

});

module.exports = router;
