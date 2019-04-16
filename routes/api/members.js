const express = require('express');
const uuid = require('uuid');

const members = require('../../Members');

const router = express.Router();

// Gets all members
// Since the route is in index.js declared we can use only a "/"
// router.get("/api/members", (req, res) => res.json(members));
router.get('/', (req, res) => res.json(members));

///////////////
///// Get Single Member
///////////////
router.get('/:id', (req, res) => {
  // Check if the member id exist in the members array
  const found = members.some(member => member.id === parseInt(req.params.id));

  // If the member exist show the member
  if (found) {
    // The id is parsed because member.id, from the object array, is a number and req.params.id is a string
    res.json(members.filter(member => member.id === parseInt(req.params.id)));
  }
  // If is not exist response with a status 400 Bad Request
  else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

///////////////
///// Create Member
///////////////
router.post('/', (req, res) => {
  // New Member schema
  const newMember = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email,
    status: 'active'
  };

  // Check if the field are filled
  if (!newMember.name || !newMember.email) {
    return res.status(400).json({ msg: 'Please include a name and email' });
  }

  // After the check we Push the newMember into Members array
  members.push(newMember);
  // Respond with all the Members array
  res.json(members);
  // res.redirect("/");
});

///////////////
///// Update Member
///////////////
router.put('/:id', (req, res) => {
  // Check if the member id exist in the members array
  const found = members.some(member => member.id === parseInt(req.params.id));

  // If the id exist
  if (found) {
    // We store a request body in a variable
    const updMember = req.body;
    // Loop through the member array
    members.forEach(member => {
      // If the id correnspond with the request
      if (member.id === parseInt(req.params.id)) {
        // Set the member name depending if is sendet otherwise we keep the stored name
        member.name = updMember.name ? updMember.name : member.name;
        member.email = updMember.email ? updMember.email : member.email;

        // We send a response
        res.json({ msg: 'Member updated', member });
      }
    });
  }
  // If is not exist response with a status 400 Bad Request
  else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

//////////////
///// Delete Member
///////////////
router.delete('/:id', (req, res) => {
  // Check if the member id exist in the members array
  const found = members.some(member => member.id === parseInt(req.params.id));

  // If the member exist
  if (found) {
    // We filter out the member that we wanna delete and return the updated array
    res.json({
      msg: 'Member deleted!',
      members: members.filter(member => member.id !== parseInt(req.params.id))
    });
  }
  // If is not exist response with a status 400 Bad Request
  else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

module.exports = router;
