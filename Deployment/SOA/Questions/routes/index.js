const express = require('express');
const axios = require('axios');
const router = express.Router();

const AuthorizedToken = async (token) => {
    reqBody = {
        actionType: 'TokenAuthorization',
        parameters: [token]
    }

    // Check if TokenAuthorization action is provided by another service
    const {data:services} = await axios.get('https://soa-esb.herokuapp.com/serviceDiscovery');
    console.log(services);
    let auth_offered = false;

    // Loop through actions provided
    for (const key of Object.keys(services)) {
        if (key === 'Authorization' && Object.keys(services[key])[0]==='TokenAuthorization')
            auth_offered = true;
    }

    if (auth_offered) {
        const authorizationRes = await axios.post('https://soa-esb.herokuapp.com/serviceExecution', reqBody);
        console.log(authorizationRes);
        return authorizationRes.data.user;
    } else
        return null; // If Authorization service is unavailable
}

/* GET my Questions */
router.get('/questions/myQuestions', 
  async function(req, res) {
    const token = req.header('Authorization');
    // Authorize token
    const user = await AuthorizedToken(token);
    if(!user){
        return res.status(401).send('Unauthorized');
    }

    const {data:result}= await axios.post(`https://soa-data-layer.herokuapp.com/getMyQuestions`, {user});
    res.send(result);
});

/* GET questions per keyword */
router.get('/questions/PerKeyword', async function(req, res) {
    const {data:results}= await axios.post(`https://soa-data-layer.herokuapp.com/getQuestPerKey`);
    let perkeyword=[];
    for (let i = 0; i < results.length; i++) {
        perkeyword.push(results[i].keyword);
        perkeyword.push(results[i].related_questions);
    }
    res.send(perkeyword);
});

/* GET questions per day */
router.get('/questions/PerDay', async function(req, res) {
    const {data:results}= await axios.post(`https://soa-data-layer.herokuapp.com/getQuestPerDay`);
    console.log(results);
    let perday=[];
    for (let i = 0; i < results.length; i++) {
        perday.push(results[i].date);
        perday.push(results[i].related_questions);
    }
    res.send(perday);
});

/* GET all questions. */
router.get('/questions', async function(req, res) {
    const {data:results}= await axios.post(`https://soa-data-layer.herokuapp.com/getQuestions`);
    res.send(results);
});

/* Validate question by id */
router.get('/questions/:questionId', async function(req, res) {
  const questionId = req.params.questionId;
  const {data:questionIsValid}= await axios.post(`https://soa-data-layer.herokuapp.com/questionValid`, {question_id:questionId} );
  res.send(questionIsValid);
});

/* Add new question */
router.post('/questions', 
  async function (req, res){
    const token = req.header('Authorization');
    // Authorize token
    const user = await AuthorizedToken(token);
    if(!user){
        return res.status(401).send('Unauthorized');
    }

    let { title, keywords, content } = req.body; // gives title, keywords and content to body
    if(typeof keywords === 'string'){
        keywords = keywords.split(',');
    }

    // Remove whitespaces between separator ,
    keywords = keywords.map(keyword => {
      return keyword.trim();
    });

    let new_question = {
      title,
      keywords,
      content,
      creator: user
    };

    const {data:{insertId}} = await axios.post(`https://soa-data-layer.herokuapp.com/createQuestion`, {new_question});

    new_question = {
      id: insertId,
      title,
      keywords,
      content,
      creator: user
    };

    res.status(201).send(new_question);
});

router.delete('/questions/:questionId',
  async function(req, res){
    const questionId = req.params.questionId;

    const {data:deleteRes} = await axios.post(`https://soa-data-layer.herokuapp.com/deleteQuestion`,{questionId});

    if(deleteRes.affectedRows > 0){
      return res.status(200).send("OK, question deleted");
    }
    else{
      return res.status(404).send("That question was not found!");
    }
});

module.exports = router;
