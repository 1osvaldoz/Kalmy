import React from 'react';

class SelectField extends React.Component {
    render(){
      return(
      <div className="selectField" >
        <select >
          <option value="1">Por tipo</option>
          <option value="2">Por tipo y marca</option>
          <option value="3">Por marca y tipo</option>
        </select>
      </div>
    );
  }
}
export default SelectField;
 