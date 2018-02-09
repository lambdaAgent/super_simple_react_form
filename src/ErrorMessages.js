import React from 'react';

class ErrorMessages extends React.Component{

  render() {
    const props = this.props;
    const errorMessages = props.errorMessages && Array.isArray(errorMessages) ? Array.from(new Set(props.errorMessages)) : props.errorMessages;
    return (
      <div ref={props.ref}>
        {
          errorMessages &&
          Array.isArray(errorMessages) ?
          errorMessages
              .filter(message => message !== true)
              .map((message, idx) => {
                return <p key={new Date().getTime() + message + idx} style={{color:'red', marginBottom:7, marginTop: 4}}>{message}</p>;
              })
            : undefined
        }
      </div>
    );
  }
}

ErrorMessages.propTypes = {
  errorMessages: React.PropTypes.array
};

export default ErrorMessages;