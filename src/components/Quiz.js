import { Card, CardContent, CardHeader, List, ListItemButton, Typography,Box, LinearProgress, useStepContext, CardMedia } from '@mui/material';
import {makeStyles} from '@mui/styles'
import React, { useEffect, useState } from 'react'
import { BASE_URL, createAPIEndpoint, ENDPOINTS } from '../api';
import {getFormatedTime} from '../helper/index'
import useStateContext from '../hooks/useStateContext'
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  typo: {
    flexGrow: 1,
    textAlign: "right"
  }
}));

const ConvertToArabicNumbers = (num) => {
  const arabicNumbers = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
 return new String(num).replace(/[0123456789]/g, (d)=>{return arabicNumbers[d]});
}


export default function Quiz() {
  const classes = useStyles();
  const [qns,setQns] = useState([]);
  const [qnIndx,setQnIndx] = useState(0);
  const [timeTaken,setTimeTaken]=useState(0);
  const {context,setContext}= useStateContext();
  const navigate = useNavigate();
  let timer;
  
  const startTimer =()=>{
    timer=setInterval(()=>{setTimeTaken((prev)=>prev+1)},[1000]);
  }

  useEffect(()=>{ //حيتنفذ وقت ما الصفحة يصير لها ريلود بشكل كامل
    setContext({
      timeTaken:0,
      selectedOptions:[]
    })
    createAPIEndpoint(ENDPOINTS.question).fetch()
    .then(res=>{
      setQns(res.data);
      startTimer();
    })
    .catch(err=>{console.log(err);});
    return ()=>{clearInterval(timer)}

  },[]);


  const  updateAnswer = (qnId,optionIdx)=>{
    const temp =[...context.selectedOptions];
    temp.push({
      qnId,
      selected:optionIdx
    });

    if(qnIndx<4){
      setContext({selectedOptions:[...temp]});
      setQnIndx(qnIndx+1);
    }
    else{
      setContext({selectedOptions:[...temp],timeTaken});
      navigate("/result");
    }

  

  }

  return (
    qns.length!=0 ? 
    <Card
    sx={{maxWidth:640,mx:'auto',mt:5,'& .MuiCardHeader-action':{
      m:0,alignSelf:'center',
    }}}>
      <CardHeader 
      title={'السؤال ' + ConvertToArabicNumbers(qnIndx+1) +' من ' + ConvertToArabicNumbers(5)}
     action={<Typography style={{fontSize:'22px'}} >{ConvertToArabicNumbers(getFormatedTime(timeTaken))}</Typography>}
     ></CardHeader>
     <Box>
        <LinearProgress variant='determinate' value={(qnIndx+1)*100/5} />
     </Box>
     {qns[qnIndx].imageName!=null?
      <CardMedia component='img' image={BASE_URL+'images/'+qns[qnIndx].imageName} 
      sx={{
        width:'auto', m:'10px auto',height:'200px',width:'200px'
      }}/>
     :null}
      <CardContent>
        <Typography variant='h6' className={classes.typo} >
          {qns[qnIndx].qnInWords} 
        </Typography>
        <List  >
          {qns[qnIndx].options.map((item,idx)=>{
            return(  
            <ListItemButton key={idx} onClick={()=>updateAnswer(qns[qnIndx].qnId,idx)} >
             <Typography className={classes.typo} variant='subtitle1'>
              <span >{item}</span>  <b>&#8226;</b> 
               </Typography>
            </ListItemButton>
            )
          
          })}
        
        </List>
      </CardContent>
    </Card>
    :null
  )
}
