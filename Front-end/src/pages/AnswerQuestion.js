import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import "../components/Sessions.css";
import "../App.css";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function AnswerQuestion() {
  const [isError, setIsError] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [keywords, setKeywords] = useState("");
  const [complete,setComplete]=useState(true);
  const { setAuthTokens } = useAuth();

  function postAnswerQuestion() { // Backend call for signup
    axios
      .post("https://localhost:8765/evcharge/api/AnswerQuestion", {
        question: title,
        body: body,
        keywords: keywords
      })
      .then((response) => {
        // if successfull 
      })
      .catch((e) => {
        setIsError(true);
      });
  }

  function resetFields(){ // Clears all fields
    setTitle("");
    setBody("");
    setKeywords("");
} 

  const classes = useStyles();

  return (
    <Container maxWidth="sm"> 
    <div>
      <h2 type="text" className="text-header" style={{marginTop:"100px"}}>
        Answer Question
      </h2>
      <Button 
            href="/"  //Redirects to Home Page
            variant="contained" color="primary"  // Primary colour blue
            style={{  
              width: "150px", 
              marginTop: "15px", 
              marginBottom: "20px", 
              marginLeft: "30px",
              marginRight: "10px",
              fontWeight: "bold", 
              textTransform: 'none' // Lowercase letters
          }}>
          Return Home
      </Button>
      
      <div>
        <form>

        {/* Select Question */}
        <FormControl 
          className={classes.formControl}
          style={{ 
            marginTop: "10px",
            marginLeft: "30px",
            marginRight: "30px",
            width:"450px" }}>
          <InputLabel htmlFor="grouped-select">Question</InputLabel>
          <Select defaultValue="" id="grouped-select">
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <ListSubheader>Category 1</ListSubheader>
            <MenuItem value={1}>Question 1</MenuItem>
            <MenuItem value={2}>Question 2</MenuItem>
            <ListSubheader>Category 2</ListSubheader>
            <MenuItem value={3}>Question 3</MenuItem>
            <MenuItem value={4}>Question 4</MenuItem>
          </Select>
        </FormControl>

          {/* Question Keywords */}
          <TextField
          id="standard-textarea"
          label="Question Keywords"
          multiline
          placeholder="Question Keywords"
            InputProps={{
              readOnly: true,}}
          style={{ 
            marginTop: "10px",
            marginLeft: "30px",
            marginRight: "30px",
            width:"450px" }}
          value={keywords}
          onChange={(e) => {
              setKeywords(e.target.value);
            }}
          />

          {/* Answer Text Field */}
          <TextField
          id="filled-textarea"
          label="Your Answer"
          placeholder="Your Answer"
          multiline
          variant="filled"
            style={{ 
              marginTop: "30px",
              marginLeft: "30px",
              marginRight: "30px", 
              width:"450px"}}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
        />

          {/* Submit Button */}
          <Button
             variant="contained" 
             color="primary" 
             style={{ 
              marginTop: "10px", 
              marginBottom: "10px" , 
              marginLeft: "30px",
              marginRight: "10px",
              fontWeight: "bold",
              textTransform: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              if(title!=="" && body!=="" && keywords!=="") {
                setComplete(true); 
                postAnswerQuestion();}
              else setComplete(false);
            }}
          >
            Submit
          </Button>

          {/* Reset Button */}
          <Button
            type="reset"
            variant="contained" 
            color="secondary" 
            style={{ 
              marginTop: "10px", 
              marginBottom: "10px" , 
              marginRight: "10px",
              fontWeight: "bold",
              textTransform: 'none' }}
            onClick={(e) => {
              resetFields() // If cancel pressed, clear fields
            }}
          >
            Reset
          </Button>
        </form>

        {/* If error during backend call happens*/}
        {isError && (
           <Typography variant="body1" gutterBottom
            style={{ 
              marginTop: "15px",
              marginLeft: "30px",
              fontWeight:"bold" }}>
            Error happened!
          </Typography>
        )}

        {/* If all fields are not completed */}
        {complete===false && (
           <Typography variant="body1" gutterBottom
            style={{ 
              marginTop: "15px",
              marginLeft: "30px",
              fontWeight:"bold" }}>
            All fields required.
          </Typography>
        )}

      </div>
    </div>
    </Container>
  );
}
export default AnswerQuestion;