import React from 'react';

function Spinner(){
    return (
        <div class="clearfix">
          <div class="spinner-border float-right" style={{marginRight:10,marginTop:10}} role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
    )
}

export default Spinner;