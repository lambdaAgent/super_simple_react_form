# A Dead Simple Form For React

background:
I feel the direction of form libraries in the market is like trying to bundle everything at once.
The common direction of these libraries is to create isolated state inside the form, and provide API and component for developer to manipulate the isolated state.

Cases after cases, I have problem to integrate individual React's components with this form. 

### Then comes the idea:
Why can't there be a form that just do one thing, to validate and that it will work with any kind of component?

### Simple Concept
1. provide value and validator functions to the input element.
2. SimpleForm will search it's children and when it find validators, it will validate against it's value


### Simple Rules are better than many APIs
    import { SimpleForm, validations } from 'super-simple-react-form';
    const { required, minValue } = validations;
    
    class Form extends React.Component {
        constructor(props){
          super(props);
          this.state = {
            input1: '',
          };
        }
        render(){
            return (
                <SimpleForm onSubmit={}>
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

**4**) Please provide custom errorElement if you wish.
