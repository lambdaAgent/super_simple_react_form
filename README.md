# A Dead Simple Form For React

### Motivation:
I feel the direction of form libraries in the market is like trying to bundle everything at once.
The common direction of these libraries is to create isolated state inside the form, and provide API for developer to manipulate the isolated state.

Problems: 
1. A need to create custom component to work with the Form library.
2. Problem to integrate another React's components on npm with the form's component.
3. Components that has been created / modified is locked to certain Form library.
4. Need to continuously learn API depends on the flavour of the library.
5. It usually takes some effort to bend the library to cover certain cases.

### Then comes the idea:
1. Why can't there be a form that just do validation and that it will work with any kind of component?
2. Leave the rest of data manipulation to developer. This way we can easily cover infinite cases.

### Concept:
1. ***Simple Rules are better than many APIs***
2. User just need to provide 2 props: ```value```, ```data-validators```
3. SimpleForm will check for these 2 props, and validate if these 2 props existed.

### Example:
    import { SimpleForm, validations } from 'super-simple-react-form';
    const { required, minValue } = validations;
    
    export default class Component extends React.Component {
        constructor(props){
          super(props);
          this.state = {
            input1: '',
          };
        }
        render(){
            return (
                <SimpleForm onSubmit={this.handleSubmit.bind(this)}>
                    <div>                                               {/* 1 */}
                        <input
                           value={this.state.input1}                    {/* 2 */} 
                           data-validators={[required, minValue(10)]}   {/* 3 */}
                           onChange={e => this.setState({input1: e.target.value})}
                        />
                    </div>
                    <div>
                        <CustomInput 
                            value='hello'                    {/* 2 */}
                            data-validators={[required]}     {/* 3 */}
                        />
                    </div>
                    <div errorElement={<CustomErrorElement/>}>   {/* 4 */}
                        <CustomInput 
                            value='hello'                        {/* 2 */}
                            data-validators={[required]}         {/* 3 */}
                        />
                    </div>
                </SimpleForm>
            );
        }
        handleSubmit(e, {isValids}){
            e.preventDefault();
            console.log(isValids);
        }
    };
    
    const CustomInput = props => {
        return <div>
            <input {...props}/>
        </div>
    }
### Rules:
**1**) Wrap the input element with div, SimpleForm will inject errorElement and render the errorMessages here.

**2**) Provide the value props.

**3**) Provide the validator functions to props data-validators

**4**) Provide custom errorElement if you wish, make sure it has props errorMessages.

### List of validation functions:
1. required
2. minLength(String) 
3. maxLength(String) 
4. minValue(Number)
5. maxValue(Number)
6. oneOfValue(Array) 
7. preventScriptTag

### Future Features:
1. validate onBlur.
2. mark the invalid input, as invalid attributes, like the usual HTML ```<input invalid/>```
3. more validation functions.