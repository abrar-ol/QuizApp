import {useState} from 'react'

export default function useForm(getFreshModelObject) {
  const [values, setValues] = useState(getFreshModelObject());
  const [errors,setErrors] = useState({});
  const handelInputChange = e =>{
      const {name, value} = e.target
      setValues({ // كل القيم رجعها لي نفسها ولو فيه تغيير ب نيم معين حط له الفاليو الجديد
          ...values,
          [name]: value
      })
  }

    return {
    values,
    setValues,
    errors,
    setErrors,
    handelInputChange
    }
}
