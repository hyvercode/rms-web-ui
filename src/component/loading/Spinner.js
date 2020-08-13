import React from 'react';

function Spinner(){
    return (
      <div class="clearfix">
      <div class="spinner-border float-left spinner-border-sm" role="status" style={{marginTop:10,marginLeft:20}}>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    )
}

export default Spinner;