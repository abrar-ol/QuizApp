import React, { useEffect,useState } from 'react'
import { createAPIEndpoint, ENDPOINTS } from '../api';
import useStateContext from '../hooks/useStateContext'
import { Alert, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Box } from '@mui/system'
import { green } from '@mui/material/colors';
import { getFormatedTime } from '../helper';
import { useNavigate } from 'react-router';
import Answer from './Answer';


const ConvertToArabicNumbers = (num) => {
  const arabicNumbers = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
 return new String(num).replace(/[0123456789]/g, (d)=>{return arabicNumbers[d]});
}



export default function Result() {
  const {context,setContext} = useStateContext();
  const [score,setScore]= useState(0);
  const [qnAnswers,setQnAnswers] = useState([]);
  const navigate = useNavigate()
  const [showAlert, setShowAlert] = useState(false)



  useEffect(()=>{
    const ids = context.selectedOptions.map(x=>x.qnId)
    createAPIEndpoint(ENDPOINTS.getAnswers)
    .post(ids)
    .then(res=>{
      const qna = context.selectedOptions
      .map(x=>({
        ...x,
        ...(res.data.find(y=>y.qnId==x.qnId))
      }))
      setQnAnswers(qna)
      calculateScore(qna)
    })
    .catch(err=>console.log(err))
  }, []);

  const calculateScore = qna=>{
     let tempScore =  qna.reduce((acc,curr)=>{
      return curr.answer == acc.selectedOptions? acc+1:acc;
    },0);

    setScore(tempScore);
  }

  const restart = () => {
    setContext({
      timeTaken: 0,
      selectedOptions: []
    })
    navigate("/quiz")
  }

  const submitScore = () => {
    createAPIEndpoint(ENDPOINTS.participant)
      .put(context.participantId, {
        participantId: context.participantId,
        score: score,
        timeTaken: context.timeTaken
      })
      .then(res => {
        setShowAlert(true)
        setTimeout(() => {
          setShowAlert(false)
        }, 4000);
      })
      .catch(err => { console.log(err) })
  }

  return (
    <>
    <Card sx={{ mt: 5, display: 'flex', width: '100%', maxWidth: 640, mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
          <Typography variant="h4">مبــــــــــــروووك!</Typography>
          <Typography variant="h6">
            نتيجتك
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            <Typography variant="span" color={green[500]}>
              {ConvertToArabicNumbers(score)}
            </Typography>/{ConvertToArabicNumbers(5)}
          </Typography>
          <Typography variant="h6">
            أخذ منك {ConvertToArabicNumbers(getFormatedTime(context.timeTaken))+ ' دقيقة'}
          </Typography>
          <Button variant="contained"
            sx={{ mx: 1 }}
            size="small"
            onClick={submitScore}>
            ارسل النتيجة
          </Button>
          <Button variant="contained"
            sx={{ mx: 1 }}
            size="small"
            onClick={restart}>
            مرة ثانية؟
          </Button>
          <Alert
            severity="success"
            variant="string"
            sx={{
              width: '60%',
              m: 'auto',
              visibility: showAlert ? 'visible' : 'hidden'
            }}>
            تحدثت النتيجة
          </Alert>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 220 }}
        image="./result.png"
      />
    </Card>
    <Answer qnAnswers={qnAnswers} />
  </>
  )
}
