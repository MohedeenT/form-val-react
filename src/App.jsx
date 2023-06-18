import { useImmer } from 'use-immer';
import './css/main.css'

const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
const numberRegex = /\d/;



function App() {

  const [state, setState] = useImmer(
    {
       data: {
        age:null,
        password: ""
       } ,
       showPass: false,
       validation: {
        age:true,
        password: true,
        passwordErrorMessages: []
       }
    }
      );

  const checkAge = (age)=> {return ( isNaN(age) || age > 130) ?  false : true}

  const checkPwd = (pwd)=>{
    const pwdErrorArr = []
    pwd.length < 5 && pwdErrorArr.push('must be greater than 5 characters.')
    !specialCharRegex.test(pwd) && pwdErrorArr.push('must include a special character')
    !numberRegex.test(pwd) && pwdErrorArr.push('must contain at least one number')

    return pwdErrorArr
  }

  function ErrorMessages(errorArray) {
    return (
      <>
        {errorArray.map((error, index) => (
          <p key={`error-${index}`} className='validator-err'>{error}</p>
        ))}
      </>
    );
  }
  

  return (<>
       <form id="my-form" className="shadow">
      <h4>Form Validator</h4>
      <div className="mb-4">
        <label>Age</label>
        <input 
        className="form-control"
        type="text"
        data-rules="required|digits:5|min:5"
        placeholder='enter your age'
        onChange={(e)=>{
         setState(draft=>{
          draft.data.age = +e.target.value
        })
        }}
        onBlur={()=>{
          setState(draft=>{
            draft.validation.age = checkAge(state.data.age)
          })
        }}/>
        {!state.validation.age && <p className='validator-err'>Age must be a number and must be between 0 and 130</p>}
      </div>
      <div className="mb-4">
        <label>Password</label>
        <input 
        className="form-control" 
        type={state.showPass ? 'text':'password'} 
        data-rules="required|string|min:5"
        placeholder='enter password'
        onChange={(e)=>{
          setState(draft=>{
            draft.data.password = e.target.value
          })
        }}
        onBlur={()=>{
          const errors = checkPwd(state.data.password)
          setState(draft=>{
            draft.validation.passwordErrorMessages =  errors
            draft.validation.password = false
          })
        }}
        />
        <button
        id='show-pw'
        onClick={(e)=>{
        e.preventDefault()
          setState(draft=>{
            draft.showPass = !draft.showPass
          })
        }}
        >password toggle</button>
        {!state.validation.password && ErrorMessages(state.validation.passwordErrorMessages)}
      <button
      disabled={!state.validation.age || !state.validation.password ? true:false}
      onClick={(e)=>{e.preventDefault()}}
      >Submit</button>
      </div>
    </form>
  </>
  );
}

export default App;
