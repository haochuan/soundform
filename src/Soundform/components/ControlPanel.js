import React, { Component } from 'react';

export class ControlPanel extends Component {
    render() {
        return {
            <div className='card-panel'>
                <div className='row'>
                    <div className="col s4 m4">
                        <form action="#">
                           <p>
                             <input name="type" type="radio" value='sine' checked/>
                             <label for="sine">Sine</label>
                           </p>
                           <p>
                             <input name="type" type="radio" value='triangle'/>
                             <label for="triangle">Triangle</label>
                           </p>
                           <p>
                             <input name="type" type="radio" value='sawtooth'/>
                             <label for="saw">Saw</label>
                           </p>
                             <p>
                               <input name="type" type="radio" value='square'/>
                               <label for="square">Square</label>
                           </p>
                       </form>
                    </div>

                    <div className="col s8 m8">
                        <div className='row'>
                            <p className="range-field">
                               <input type="range" min="20" max="1000" />
                             </p>
                        </div>
                        <div className='row'>
                            <div className="switch">
                               <label>
                                 Off
                                 <input type="checkbox">
                                 <span className="lever"></span>
                                 On
                               </label>
                             </div>
                        </div>
                    </div>
                </div> 
            </div>  
        }
    }
}